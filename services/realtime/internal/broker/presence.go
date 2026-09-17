package broker

import (
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"

	"nexustimer/realtime/internal/hub"
)

// Presence keys, mirrored in src/shared/lib/realtime/presence.ts.
const (
	// One field per open tab, "{instanceID}:{unixSeconds}:{idle 0|1}". Nothing refreshes these:
	// an entry is live while the instance that wrote it is.
	connsKeyPrefix        = "rt:conns:"
	statusKeyPrefix       = "rt:status:"
	lastSeenKeyPrefix     = "rt:lastseen:"
	gatewayKeyPrefix      = "rt:gw:"
	PresenceChannelPrefix = "rt:presence:"

	leaseTTL     = 60 * time.Second
	leaseRefresh = 20 * time.Second

	// offlineGrace keeps a reload from blinking offline for everyone watching.
	offlineGrace    = 15 * time.Second
	connMaxAge      = 24 * time.Hour
	lastSeenTTL     = 30 * 24 * time.Hour
	liveCacheTTL    = 5 * time.Second
	presenceTimeout = time.Second
)

// State is what other people are allowed to see.
type State string

const (
	StateOnline  State = "online"
	StateAway    State = "away"
	StateBusy    State = "busy"
	StateOffline State = "offline"
)

// statusInvisible never leaves the gateway, except back to the person it belongs to.
const statusInvisible = "invisible"

type presenceUser struct {
	UserID string `json:"userId"`
	State  State  `json:"state"`
	// LastSeen is unix milliseconds.
	LastSeen int64 `json:"lastSeen,omitempty"`
}

// presenceEvent carries many people so a browser opening a list gets one frame, not one per row.
type presenceEvent struct {
	Type  string         `json:"type"`
	Users []presenceUser `json:"users"`
}

func (b *Broker) connValue(idle bool) string {
	flag := "0"
	if idle {
		flag = "1"
	}
	return b.instanceID + ":" + strconv.FormatInt(time.Now().Unix(), 10) + ":" + flag
}

type connEntry struct {
	instanceID string
	seconds    int64
	idle       bool
}

func parseConnValue(value string) (connEntry, bool) {
	instanceID, rest, found := strings.Cut(value, ":")
	if !found || instanceID == "" {
		return connEntry{}, false
	}
	stamp, flag, found := strings.Cut(rest, ":")
	if !found {
		return connEntry{}, false
	}
	seconds, err := strconv.ParseInt(stamp, 10, 64)
	if err != nil {
		return connEntry{}, false
	}
	return connEntry{instanceID: instanceID, seconds: seconds, idle: flag == "1"}, true
}

// ClaimLease has to run before this instance takes any connection: its entries only count
// while this key is alive.
func (b *Broker) ClaimLease(ctx context.Context) error {
	return b.client.Set(ctx, gatewayKeyPrefix+b.instanceID, "1", leaseTTL).Err()
}

// KeepLease renews the lease until ctx is done, then drops it so nobody waits out the TTL.
// local supplies this instance's open connections: with no per-connection refresh, rewriting
// them is the only way back from a Redis outage.
func (b *Broker) KeepLease(ctx context.Context, local func() []hub.Connection) {
	ticker := time.NewTicker(leaseRefresh)
	defer ticker.Stop()

	healthy := true
	for {
		select {
		case <-ctx.Done():
			drop, cancel := context.WithTimeout(context.Background(), presenceTimeout)
			if err := b.client.Del(drop, gatewayKeyPrefix+b.instanceID).Err(); err != nil {
				b.logger.Warn("dropping lease failed", "error", err)
			}
			cancel()
			return
		case <-ticker.C:
			renew, cancel := context.WithTimeout(ctx, presenceTimeout)
			err := b.ClaimLease(renew)
			cancel()

			if err != nil {
				if healthy {
					b.logger.Warn("renewing lease failed", "error", err)
				}
				healthy = false
				continue
			}
			if !healthy {
				b.logger.Info("lease recovered, rewriting connections")
				b.resync(ctx, local())
			}
			healthy = true
		}
	}
}

// resync rewrites every open connection after Redis was unreachable. Entries deleted while it
// was down stay behind until connMaxAge.
func (b *Broker) resync(ctx context.Context, conns []hub.Connection) {
	if len(conns) == 0 {
		return
	}

	write, cancel := context.WithTimeout(ctx, presenceTimeout*5)
	defer cancel()

	pipe := b.client.Pipeline()
	for _, conn := range conns {
		pipe.HSet(write, connsKeyPrefix+conn.UserID, conn.ConnID, b.connValue(conn.Idle))
	}
	if _, err := pipe.Exec(write); err != nil {
		b.logger.Warn("rewriting connections failed", "error", err, "connections", len(conns))
	}
}

// Connected records a new tab, tells everyone watching, and hands that tab its own declared
// status, which is what keeps the status picker off the Next.js API.
func (b *Broker) Connected(c hub.Conn) {
	ctx, cancel := context.WithTimeout(context.Background(), presenceTimeout)
	defer cancel()

	if err := b.write(ctx, c.UserID(), c.ConnID(), c.Idle()); err != nil {
		b.logger.Warn("presence connect failed", "error", err)
		return
	}
	b.PublishPresence(ctx, c.UserID())

	if frame := b.selfStatus(ctx, c.UserID()); frame != nil {
		c.Send(frame)
	}
}

type selfStatusEvent struct {
	Type   string `json:"type"`
	Status string `json:"status"`
}

func (b *Broker) selfStatus(ctx context.Context, userID string) []byte {
	key := statusKeyPrefix + userID
	pipe := b.client.Pipeline()
	read := pipe.Get(ctx, key)
	// The declared status must never expire, so a key an older deploy wrote with a TTL is healed
	// the next time its owner connects.
	pipe.Persist(ctx, key)
	if _, err := pipe.Exec(ctx); err != nil && !errors.Is(err, redis.Nil) {
		b.logger.Warn("self status read failed", "error", err)
		return nil
	}

	status := read.Val()
	if status == "" {
		status = string(StateOnline)
	}

	payload, err := json.Marshal(selfStatusEvent{Type: "presence:self", Status: status})
	if err != nil {
		return nil
	}
	return payload
}

// Disconnected waits out offlineGrace before announcing the last tab leaving, so a reload does
// not read as going offline.
func (b *Broker) Disconnected(userID, connID string) {
	ctx, cancel := context.WithTimeout(context.Background(), presenceTimeout)
	defer cancel()

	key := connsKeyPrefix + userID
	pipe := b.client.Pipeline()
	pipe.HDel(ctx, key, connID)
	left := pipe.HLen(ctx, key)
	// Rides along so the write below costs no extra round trip. redis.Nil only means the status
	// key is missing, which is every person who never picked one.
	declared := pipe.Get(ctx, statusKeyPrefix+userID)
	if _, err := pipe.Exec(ctx); err != nil && !errors.Is(err, redis.Nil) {
		b.logger.Warn("presence disconnect failed", "error", err)
		return
	}

	if left.Val() > 0 {
		b.PublishPresence(ctx, userID)
		return
	}

	// An invisible person was already stamped when they declared it, and they have read as
	// offline ever since. Moving the stamp now would jump their last seen forward with no online
	// spell in between, which is exactly how a watcher spots that they had been there all along.
	if declared.Val() != statusInvisible {
		stamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
		if err := b.client.Set(ctx, lastSeenKeyPrefix+userID, stamp, lastSeenTTL).Err(); err != nil {
			b.logger.Warn("last seen failed", "error", err)
		}
	}
	b.publishAfterGrace(userID)
}

func (b *Broker) publishAfterGrace(userID string) {
	time.AfterFunc(offlineGrace, func() {
		select {
		case <-b.done:
			return
		default:
		}

		ctx, cancel := context.WithTimeout(context.Background(), presenceTimeout)
		defer cancel()
		b.PublishPresence(ctx, userID)
	})
}

func (b *Broker) SetIdle(userID, connID string, idle bool) {
	ctx, cancel := context.WithTimeout(context.Background(), presenceTimeout)
	defer cancel()

	if err := b.write(ctx, userID, connID, idle); err != nil {
		b.logger.Warn("presence idle failed", "error", err)
		return
	}
	b.PublishPresence(ctx, userID)
}

// write is only ever called on a real event, never on a timer.
func (b *Broker) write(ctx context.Context, userID, connID string, idle bool) error {
	return b.client.HSet(ctx, connsKeyPrefix+userID, connID, b.connValue(idle)).Err()
}

// PublishPresence reaches every gateway instance, not just this one.
func (b *Broker) PublishPresence(ctx context.Context, userID string) {
	payload, err := json.Marshal(presenceEvent{Type: "presence", Users: b.resolve(ctx, []string{userID})})
	if err != nil {
		return
	}
	if err := b.client.Publish(ctx, PresenceChannelPrefix+userID, payload).Err(); err != nil {
		b.logger.Warn("publish presence failed", "error", err)
	}
}

func (b *Broker) Snapshot(ctx context.Context, userIDs []string) []byte {
	if len(userIDs) == 0 {
		return nil
	}
	payload, err := json.Marshal(presenceEvent{Type: "presence", Users: b.resolve(ctx, userIDs)})
	if err != nil {
		return nil
	}
	return payload
}

// resolve reads everyone in one round trip; an invisible person reads as offline.
func (b *Broker) resolve(ctx context.Context, userIDs []string) []presenceUser {
	type pending struct {
		conns    *redis.MapStringStringCmd
		status   *redis.StringCmd
		lastSeen *redis.StringCmd
	}

	pipe := b.client.Pipeline()
	reads := make([]pending, len(userIDs))
	for i, id := range userIDs {
		reads[i] = pending{
			conns:    pipe.HGetAll(ctx, connsKeyPrefix+id),
			status:   pipe.Get(ctx, statusKeyPrefix+id),
			lastSeen: pipe.Get(ctx, lastSeenKeyPrefix+id),
		}
	}

	// redis.Nil only means one of the reads found nothing, which is the common case.
	if _, err := pipe.Exec(ctx); err != nil && !errors.Is(err, redis.Nil) {
		b.logger.Warn("presence read failed", "error", err)
		offline := make([]presenceUser, len(userIDs))
		for i, id := range userIDs {
			offline[i] = presenceUser{UserID: id, State: StateOffline}
		}
		return offline
	}

	entries := make([][]connEntry, len(userIDs))
	referenced := make(map[string]struct{})
	for i := range userIDs {
		for _, value := range reads[i].conns.Val() {
			entry, ok := parseConnValue(value)
			if !ok {
				continue
			}
			entries[i] = append(entries[i], entry)
			referenced[entry.instanceID] = struct{}{}
		}
	}
	live := b.liveInstances(ctx, referenced)

	users := make([]presenceUser, len(userIDs))
	stale := make(map[string][]string)
	for i, id := range userIDs {
		reachable, allIdle := summarize(entries[i], live)
		if expired := expiredFields(reads[i].conns.Val(), live); len(expired) > 0 {
			stale[id] = expired
		}

		users[i] = presenceUser{UserID: id, State: StateOffline}
		declared := reads[i].status.Val()

		switch {
		// An invisible person reports their last seen like anyone offline: without it they would
		// be the only row with no wording under the dot, which is the tell the status avoids.
		case declared == statusInvisible || !reachable:
			users[i].LastSeen, _ = strconv.ParseInt(reads[i].lastSeen.Val(), 10, 64)
		case declared == string(StateBusy):
			users[i].State = StateBusy
		case declared == string(StateAway) || allIdle:
			users[i].State = StateAway
		default:
			users[i].State = StateOnline
		}
	}

	b.prune(ctx, stale)
	return users
}

func summarize(entries []connEntry, live map[string]bool) (reachable bool, allIdle bool) {
	allIdle = true
	for _, entry := range entries {
		if !isLive(entry, live) {
			continue
		}
		reachable = true
		if !entry.idle {
			allIdle = false
		}
	}
	return reachable, allIdle
}

func isLive(entry connEntry, live map[string]bool) bool {
	if !live[entry.instanceID] {
		return false
	}
	return time.Since(time.Unix(entry.seconds, 0)) < connMaxAge
}

func expiredFields(conns map[string]string, live map[string]bool) []string {
	var expired []string
	for connID, value := range conns {
		entry, ok := parseConnValue(value)
		if !ok || !isLive(entry, live) {
			expired = append(expired, connID)
		}
	}
	return expired
}

// liveInstances answers for the referenced gateways only, and the answer it returns belongs to
// the caller: b.live is shared between concurrent resolves, so it never leaves this function.
// The Redis read runs without the lock, since two resolves asking the same question is cheaper
// than every resolve queueing behind one round trip.
func (b *Broker) liveInstances(ctx context.Context, referenced map[string]struct{}) map[string]bool {
	if len(referenced) == 0 {
		return nil
	}

	live := make(map[string]bool, len(referenced))
	unknown := make([]string, 0, len(referenced))

	b.liveMu.Lock()
	if time.Now().After(b.liveUntil) {
		b.live = make(map[string]bool, len(referenced))
		b.liveUntil = time.Now().Add(liveCacheTTL)
	}
	for id := range referenced {
		if id == b.instanceID {
			live[id] = true
			continue
		}
		if known, cached := b.live[id]; cached {
			live[id] = known
			continue
		}
		unknown = append(unknown, id)
	}
	b.liveMu.Unlock()

	if len(unknown) == 0 {
		return live
	}

	pipe := b.client.Pipeline()
	checks := make([]*redis.IntCmd, len(unknown))
	for i, id := range unknown {
		checks[i] = pipe.Exists(ctx, gatewayKeyPrefix+id)
	}
	if _, err := pipe.Exec(ctx); err != nil && !errors.Is(err, redis.Nil) {
		b.logger.Warn("gateway lease read failed", "error", err)
		// Assume the gateways are up rather than reporting everyone on them offline, and do not
		// cache a guess: the next resolve should ask again.
		for _, id := range unknown {
			live[id] = true
		}
		return live
	}

	b.liveMu.Lock()
	for i, id := range unknown {
		alive := checks[i].Val() == 1
		live[id] = alive
		b.live[id] = alive
	}
	b.liveMu.Unlock()

	return live
}

// prune is best effort: a failure only means the next read prunes them instead.
func (b *Broker) prune(ctx context.Context, stale map[string][]string) {
	if len(stale) == 0 {
		return
	}
	pipe := b.client.Pipeline()
	for userID, connIDs := range stale {
		pipe.HDel(ctx, connsKeyPrefix+userID, connIDs...)
	}
	if _, err := pipe.Exec(ctx); err != nil {
		b.logger.Debug("presence prune failed", "error", err)
	}
}

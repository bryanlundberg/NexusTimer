package rooms

import (
	"cmp"
	"context"
	"crypto/rand"
	"encoding/json"
	"log/slog"
	"slices"
	"strings"
	"sync"
	"time"

	"nexustimer/realtime/internal/hub"
)

const (
	roomIDAlphabet = "abcdefghjkmnpqrstuvwxyz23456789"
	roomIDLength   = 8
	codeAlphabet   = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	codeLength     = 6
)

type seat struct {
	roomID string
	connID string
}

// Manager creates rooms, routes room frames to their actors and keeps one seat per account.
type Manager struct {
	cfg       Config
	store     Store
	scrambles ScrambleSource
	logger    *slog.Logger
	now       func() time.Time

	maxRooms      int
	lobbyInterval time.Duration
	retryBase     time.Duration

	ctx context.Context
	wg  sync.WaitGroup

	mu         sync.Mutex
	rooms      map[string]*actor
	seats      map[string]seat
	connRooms  map[string]map[string]struct{}
	watchers   map[string]hub.Conn
	summaries  map[string]SummaryView
	lobbyDirty bool
}

func NewManager(cfg Config, store Store, scrambles ScrambleSource, logger *slog.Logger) *Manager {
	return &Manager{
		cfg:           cfg,
		store:         store,
		scrambles:     scrambles,
		logger:        logger,
		now:           time.Now,
		maxRooms:      500,
		lobbyInterval: time.Second,
		retryBase:     time.Second,
		rooms:         map[string]*actor{},
		seats:         map[string]seat{},
		connRooms:     map[string]map[string]struct{}{},
		watchers:      map[string]hub.Conn{},
		summaries:     map[string]SummaryView{},
	}
}

// Start restores the saved rooms; it must run before the first connection arrives.
func (m *Manager) Start(ctx context.Context) {
	m.ctx = ctx
	m.restore(ctx)
	m.wg.Go(func() { m.runLobby(ctx) })
}

func (m *Manager) Wait() { m.wg.Wait() }

func (m *Manager) restore(ctx context.Context) {
	load, cancel := context.WithTimeout(ctx, 10*time.Second)
	states, err := m.store.LoadAll(load)
	cancel()
	if err != nil {
		m.logger.Warn("loading rooms failed", "error", err)
	}

	now := m.now()
	for _, state := range states {
		room, fx := Restore(m.cfg, state, now)
		a := newActor(m, room)
		if room.Closed() {
			a.deleteState(ctx)
			continue
		}

		m.mu.Lock()
		m.rooms[room.ID()] = a
		m.summaries[room.ID()] = room.Summary()
		for _, p := range room.state.Players {
			m.seats[p.UserID] = seat{roomID: room.ID()}
		}
		m.lobbyDirty = true
		m.mu.Unlock()

		a.apply(ctx, fx)
		m.wg.Go(func() { a.run(ctx) })
	}
	if len(states) > 0 {
		m.logger.Info("rooms restored", "rooms", len(states))
	}
}

// Inbound handles room:* and rooms:* frames and reports whether the frame was one of them.
func (m *Manager) Inbound(c hub.Conn, payload []byte) bool {
	var f struct {
		Type         string  `json:"type"`
		Rid          int64   `json:"rid"`
		RoomID       string  `json:"roomId"`
		Code         string  `json:"code"`
		Protocol     int     `json:"protocol"`
		Name         string  `json:"name"`
		Event        string  `json:"event"`
		MaxRoundTime int     `json:"maxRoundTime"`
		Private      bool    `json:"private"`
		Status       Status  `json:"status"`
		Round        int     `json:"round"`
		Time         int64   `json:"time"`
		Penalty      Penalty `json:"penalty"`
		UserID       string  `json:"userId"`
	}
	if json.Unmarshal(payload, &f) != nil {
		return false
	}
	if !strings.HasPrefix(f.Type, "room:") && !strings.HasPrefix(f.Type, "rooms:") {
		return false
	}

	connID := c.ConnID()
	switch f.Type {
	case "room:create":
		m.create(c, Settings{Name: f.Name, Event: f.Event, MaxRoundTime: f.MaxRoundTime}, f.Private, f.Rid)
	case "room:join":
		m.forward(c, f.RoomID, f.Rid, Join{
			ConnID:   connID,
			UserID:   c.UserID(),
			Name:     c.Name(),
			Image:    c.Image(),
			Code:     f.Code,
			Rid:      f.Rid,
			Protocol: f.Protocol,
		})
	case "room:leave":
		m.forward(c, f.RoomID, 0, Leave{ConnID: connID})
	case "room:status":
		m.forward(c, f.RoomID, 0, ReportStatus{ConnID: connID, Status: f.Status})
	case "room:solve":
		m.forward(c, f.RoomID, f.Rid, SubmitSolve{ConnID: connID, Rid: f.Rid, Round: f.Round, Time: f.Time})
	case "room:penalty":
		m.forward(c, f.RoomID, f.Rid, SetPenalty{ConnID: connID, Rid: f.Rid, Round: f.Round, Penalty: f.Penalty})
	case "room:kick":
		m.forward(c, f.RoomID, f.Rid, Kick{ConnID: connID, Rid: f.Rid, UserID: f.UserID})
	case "rooms:watch":
		m.watch(c, f.Rid)
	case "rooms:unwatch":
		m.mu.Lock()
		delete(m.watchers, connID)
		m.mu.Unlock()
	}
	return true
}

func (m *Manager) create(c hub.Conn, settings Settings, private bool, rid int64) {
	settings, err := NormalizeSettings(settings)
	if err != nil {
		m.sendError(c, rid, "", ErrInvalid)
		return
	}
	if private {
		settings.Code = randomString(codeAlphabet, codeLength)
	}

	m.mu.Lock()
	if len(m.rooms) >= m.maxRooms {
		m.mu.Unlock()
		m.sendError(c, rid, "", ErrFull)
		return
	}
	id := randomString(roomIDAlphabet, roomIDLength)
	for m.rooms[id] != nil {
		id = randomString(roomIDAlphabet, roomIDLength)
	}
	creator := Join{ConnID: c.ConnID(), UserID: c.UserID(), Name: c.Name(), Image: c.Image(), Rid: rid, Protocol: ProtocolVersion}
	room, fx := New(m.cfg, id, settings, creator, nil, m.now())
	a := newActor(m, room)
	a.conns[c.ConnID()] = c
	m.rooms[id] = a
	m.trackConnLocked(c.ConnID(), id)
	m.mu.Unlock()

	a.apply(m.ctx, fx)
	a.persist(m.ctx)
	m.seated(c.UserID(), c.ConnID(), id)
	m.wg.Go(func() { a.run(m.ctx) })
}

func (m *Manager) forward(c hub.Conn, roomID string, rid int64, input Input) {
	env := envelope{input: input}
	_, joining := input.(Join)
	if joining {
		env.conn = c
	}

	m.mu.Lock()
	a := m.rooms[roomID]
	if a != nil && joining {
		m.trackConnLocked(c.ConnID(), roomID)
	}
	m.mu.Unlock()

	if (a == nil || !a.deliver(env)) && rid > 0 {
		m.sendError(c, rid, roomID, ErrNotFound)
	}
}

func (m *Manager) trackConnLocked(connID, roomID string) {
	ids := m.connRooms[connID]
	if ids == nil {
		ids = map[string]struct{}{}
		m.connRooms[connID] = ids
	}
	ids[roomID] = struct{}{}
}

// seated moves the account's single seat; the room it leaves learns it once the join elsewhere succeeded.
func (m *Manager) seated(userID, connID, roomID string) {
	m.mu.Lock()
	previous, had := m.seats[userID]
	m.seats[userID] = seat{roomID: roomID, connID: connID}
	var left *actor
	if had && previous.roomID != roomID {
		left = m.rooms[previous.roomID]
	}
	m.mu.Unlock()

	if left != nil {
		go left.deliver(envelope{input: Moved{UserID: userID, ToRoomID: roomID}})
	}
}

func (m *Manager) seatRoom(userID string) string {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.seats[userID].roomID
}

func (m *Manager) freed(userID, roomID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.seats[userID].roomID == roomID {
		delete(m.seats, userID)
	}
}

func (m *Manager) removeRoom(roomID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.rooms, roomID)
	delete(m.summaries, roomID)
	for userID, s := range m.seats {
		if s.roomID == roomID {
			delete(m.seats, userID)
		}
	}
	m.lobbyDirty = true
}

func (m *Manager) updateSummary(summary SummaryView) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.rooms[summary.RoomID] != nil {
		m.summaries[summary.RoomID] = summary
		m.lobbyDirty = true
	}
}

func (m *Manager) Connected(hub.Conn) {}

func (m *Manager) Disconnected(_, connID string) {
	m.mu.Lock()
	delete(m.watchers, connID)
	var actors []*actor
	for roomID := range m.connRooms[connID] {
		if a := m.rooms[roomID]; a != nil {
			actors = append(actors, a)
		}
	}
	delete(m.connRooms, connID)
	m.mu.Unlock()

	for _, a := range actors {
		a.deliver(envelope{input: Disconnected{ConnID: connID}})
	}
}

func (m *Manager) watch(c hub.Conn, rid int64) {
	m.mu.Lock()
	m.watchers[c.ConnID()] = c
	rooms := m.lobbyLocked()
	m.mu.Unlock()

	if raw, err := json.Marshal(LobbyEvent{Type: "rooms:lobby", Rid: rid, Rooms: rooms}); err == nil {
		c.Send(raw)
	}
}

func (m *Manager) runLobby(ctx context.Context) {
	ticker := time.NewTicker(m.lobbyInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			m.flushLobby(ctx)
		}
	}
}

// flushLobby batches lobby changes so a busy room does not resend the list on every status change.
func (m *Manager) flushLobby(ctx context.Context) {
	m.mu.Lock()
	if !m.lobbyDirty {
		m.mu.Unlock()
		return
	}
	m.lobbyDirty = false
	rooms := m.lobbyLocked()
	watchers := make([]hub.Conn, 0, len(m.watchers))
	for _, c := range m.watchers {
		watchers = append(watchers, c)
	}
	m.mu.Unlock()

	if raw, err := json.Marshal(LobbyEvent{Type: "rooms:lobby", Rooms: rooms}); err == nil {
		for _, c := range watchers {
			c.Send(raw)
		}
	}
	save, cancel := context.WithTimeout(ctx, storeTimeout)
	defer cancel()
	if err := m.store.SaveLobby(save, rooms); err != nil {
		m.logger.Warn("saving lobby failed", "error", err)
	}
}

func (m *Manager) lobbyLocked() []SummaryView {
	rooms := make([]SummaryView, 0, len(m.summaries))
	for _, summary := range m.summaries {
		if len(summary.Players) > 0 {
			rooms = append(rooms, summary)
		}
	}
	slices.SortFunc(rooms, func(a, b SummaryView) int { return cmp.Compare(b.CreatedAt, a.CreatedAt) })
	return rooms
}

func (m *Manager) sendError(c hub.Conn, rid int64, roomID string, code ErrorCode) {
	if raw, err := json.Marshal(ErrorEvent{Type: "room:error", Rid: rid, RoomID: roomID, Code: code}); err == nil {
		c.Send(raw)
	}
}

// randomString draws without modulo bias by rejecting bytes past the last full alphabet cycle.
func randomString(alphabet string, length int) string {
	limit := 256 - 256%len(alphabet)
	out := make([]byte, 0, length)
	var buf [16]byte
	for len(out) < length {
		_, _ = rand.Read(buf[:])
		for _, b := range buf {
			if int(b) < limit && len(out) < length {
				out = append(out, alphabet[int(b)%len(alphabet)])
			}
		}
	}
	return string(out)
}

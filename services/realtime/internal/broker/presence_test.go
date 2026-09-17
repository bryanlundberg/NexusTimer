package broker

import (
	"context"
	"io"
	"log/slog"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"nexustimer/realtime/internal/hub"
)

const otherGateway = "beef0123beef0123"

func TestParseConnValue(t *testing.T) {
	cases := map[string]struct {
		value string
		want  connEntry
		wasOK bool
	}{
		"active":         {"gw1:1700000000:0", connEntry{"gw1", 1700000000, false}, true},
		"idle":           {"gw1:1700000000:1", connEntry{"gw1", 1700000000, true}, true},
		"no flag":        {"gw1:1700000000", connEntry{}, false},
		"no instance":    {":1700000000:0", connEntry{}, false},
		"not a number":   {"gw1:soon:0", connEntry{}, false},
		"old two fields": {"1700000000:0", connEntry{}, false},
		"empty":          {"", connEntry{}, false},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			got, ok := parseConnValue(tc.value)
			if got != tc.want || ok != tc.wasOK {
				t.Fatalf("got (%+v, %v), want (%+v, %v)", got, ok, tc.want, tc.wasOK)
			}
		})
	}
}

func TestSummarizeFollowsTheGatewayThatHoldsTheSocket(t *testing.T) {
	now := time.Now().Unix()
	live := map[string]bool{"up": true, "down": false}

	active := connEntry{"up", now, false}
	sleeping := connEntry{"up", now, true}
	orphan := connEntry{"down", now, false}
	ancient := connEntry{"up", now - int64(connMaxAge.Seconds()) - 10, false}

	cases := map[string]struct {
		entries         []connEntry
		wantReachable   bool
		wantEverySleepy bool
	}{
		"no tabs":                {nil, false, true},
		"one active tab":         {[]connEntry{active}, true, false},
		"every tab idle":         {[]connEntry{sleeping, sleeping}, true, true},
		"one tab still used":     {[]connEntry{sleeping, active}, true, false},
		"gateway is gone":        {[]connEntry{orphan}, false, true},
		"orphan beside a live":   {[]connEntry{orphan, active}, true, false},
		"past the backstop":      {[]connEntry{ancient}, false, true},
		"backstop beside a live": {[]connEntry{ancient, sleeping}, true, true},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			reachable, allIdle := summarize(tc.entries, live)
			if reachable != tc.wantReachable || allIdle != tc.wantEverySleepy {
				t.Fatalf("got (%v, %v), want (%v, %v)", reachable, allIdle, tc.wantReachable, tc.wantEverySleepy)
			}
		})
	}
}

// seed writes one person's presence straight into Redis, the way a gateway would.
func seed(t *testing.T, b *Broker, userID string, conns map[string]string, status, lastSeen string) {
	t.Helper()
	ctx := context.Background()
	keys := []string{connsKeyPrefix + userID, statusKeyPrefix + userID, lastSeenKeyPrefix + userID}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	for connID, value := range conns {
		b.client.HSet(ctx, connsKeyPrefix+userID, connID, value)
	}
	if status != "" {
		b.client.Set(ctx, statusKeyPrefix+userID, status, time.Minute)
	}
	if lastSeen != "" {
		b.client.Set(ctx, lastSeenKeyPrefix+userID, lastSeen, time.Minute)
	}
}

// Runs against a real Redis only when REDIS_TEST_URL is set.
func TestResolve(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()

	now := strconv.FormatInt(time.Now().Unix(), 10)
	active := map[string]string{"tab": b.instanceID + ":" + now + ":0"}
	idle := map[string]string{"tab": b.instanceID + ":" + now + ":1"}

	cases := map[string]struct {
		conns        map[string]string
		status       string
		lastSeen     string
		wantState    State
		wantLastSeen int64
	}{
		"connected":                {active, "", "", StateOnline, 0},
		"connected and online":     {active, "online", "", StateOnline, 0},
		"busy beats idle":          {idle, "busy", "", StateBusy, 0},
		"declared away":            {active, "away", "", StateAway, 0},
		"idle tab is away":         {idle, "", "", StateAway, 0},
		"gone with last seen":      {nil, "", "1700000000000", StateOffline, 1700000000000},
		"never seen":               {nil, "", "", StateOffline, 0},
		"invisible looks gone":     {active, statusInvisible, "1700000000000", StateOffline, 1700000000000},
		"invisible and never seen": {active, statusInvisible, "", StateOffline, 0},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			seed(t, b, alice, tc.conns, tc.status, tc.lastSeen)

			got := b.resolve(ctx, []string{alice})[0]
			if got.State != tc.wantState || got.LastSeen != tc.wantLastSeen {
				t.Fatalf("got %+v, want state %q last seen %d", got, tc.wantState, tc.wantLastSeen)
			}
		})
	}
}

func TestResolveDropsTabsOfAGatewayThatIsGone(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()

	now := strconv.FormatInt(time.Now().Unix(), 10)
	seed(t, b, alice, map[string]string{
		"mine":    b.instanceID + ":" + now + ":0",
		"orphan":  otherGateway + ":" + now + ":0",
		"orphan2": otherGateway + ":" + now + ":0",
	}, "", "")

	if got := b.resolve(ctx, []string{alice})[0]; got.State != StateOnline {
		t.Fatalf("got %q, want online while this gateway holds a tab", got.State)
	}

	left, err := b.client.HKeys(ctx, connsKeyPrefix+alice).Result()
	if err != nil {
		t.Fatal(err)
	}
	if len(left) != 1 || left[0] != "mine" {
		t.Fatalf("got %v, want only this gateway's tab left", left)
	}
}

func TestResolveReadsOfflineWhenOnlyADeadGatewayIsLeft(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()

	now := strconv.FormatInt(time.Now().Unix(), 10)
	seed(t, b, alice, map[string]string{"orphan": otherGateway + ":" + now + ":0"}, "", "1700000000000")

	got := b.resolve(ctx, []string{alice})[0]
	if got.State != StateOffline || got.LastSeen != 1700000000000 {
		t.Fatalf("got %+v, want offline with a last seen", got)
	}
}

func TestResolveTrustsAGatewayThatStillHoldsItsLease(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()

	lease := gatewayKeyPrefix + otherGateway
	b.client.Set(ctx, lease, "1", time.Minute)
	t.Cleanup(func() { b.client.Del(context.Background(), lease) })

	now := strconv.FormatInt(time.Now().Unix(), 10)
	seed(t, b, alice, map[string]string{"theirs": otherGateway + ":" + now + ":0"}, "", "")

	if got := b.resolve(ctx, []string{alice})[0]; got.State != StateOnline {
		t.Fatalf("got %q, want online: another gateway holds that tab", got.State)
	}
}

func TestLeaseIsOneKeyWithATTL(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	t.Cleanup(func() { b.client.Del(context.Background(), gatewayKeyPrefix+b.instanceID) })

	if err := b.ClaimLease(ctx); err != nil {
		t.Fatal(err)
	}

	ttl, err := b.client.TTL(ctx, gatewayKeyPrefix+b.instanceID).Result()
	if err != nil {
		t.Fatal(err)
	}
	if ttl <= 0 || ttl > leaseTTL {
		t.Fatalf("got ttl %v, want one between 0 and %v", ttl, leaseTTL)
	}
}

func TestResyncRewritesEveryOpenTab(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, connsKeyPrefix + bob}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	b.resync(ctx, []hub.Connection{{UserID: alice, ConnID: "one"}, {UserID: alice, ConnID: "two", Idle: true}, {UserID: bob, ConnID: "three"}})

	if got := b.client.HLen(ctx, connsKeyPrefix+alice).Val(); got != 2 {
		t.Fatalf("alice has %d tabs, want 2", got)
	}
	if got := b.resolve(ctx, []string{alice})[0]; got.State != StateOnline {
		t.Fatalf("got %q, want online", got.State)
	}
	if got := b.resolve(ctx, []string{bob})[0]; got.State != StateOnline {
		t.Fatalf("got %q, want online", got.State)
	}
}

func TestDisconnectWaitsBeforeCallingSomeoneOffline(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, lastSeenKeyPrefix + alice, statusKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	sub := b.client.Subscribe(ctx, PresenceChannelPrefix+alice)
	defer sub.Close()
	if _, err := sub.Receive(ctx); err != nil {
		t.Fatalf("subscribe: %v", err)
	}
	messages := sub.Channel()

	b.Connected(newFakeConn(alice))
	select {
	case msg := <-messages:
		if want := `"state":"online"`; !strings.Contains(msg.Payload, want) {
			t.Fatalf("got %s, want %s", msg.Payload, want)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("no online event")
	}

	b.Disconnected(alice, "conn-"+alice)

	// Stamped when they actually left, not when the grace is up
	if b.client.Exists(ctx, lastSeenKeyPrefix+alice).Val() != 1 {
		t.Fatal("last seen was not written")
	}
	// Nothing is announced yet: a reload must not read as leaving
	select {
	case msg := <-messages:
		t.Fatalf("offline was announced immediately: %s", msg.Payload)
	case <-time.After(300 * time.Millisecond):
	}

	if got := b.resolve(ctx, []string{alice})[0]; got.State != StateOffline {
		t.Fatalf("got %q, want offline: Redis is right away even before the announcement", got.State)
	}
}

func TestDisconnectLeavesAnInvisibleLastSeenAlone(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, lastSeenKeyPrefix + alice, statusKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	// Stamped when they turned invisible, which is what everyone has been reading since
	b.client.Set(ctx, statusKeyPrefix+alice, statusInvisible, time.Minute)
	b.client.Set(ctx, lastSeenKeyPrefix+alice, "1700000000000", time.Minute)

	b.Connected(newFakeConn(alice))
	b.Disconnected(alice, "conn-"+alice)

	if got := b.client.Get(ctx, lastSeenKeyPrefix+alice).Val(); got != "1700000000000" {
		t.Fatalf("last seen moved to %q: closing the tab gave away the invisible spell", got)
	}
}

func TestDisconnectAnnouncesRightAwayWhenOtherTabsRemain(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, lastSeenKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	b.Connected(newFakeConn(alice))
	second := newFakeConn(alice)
	second.connID = "second"
	b.Connected(second)

	b.Disconnected(alice, "second")

	if b.client.Exists(ctx, lastSeenKeyPrefix+alice).Val() != 0 {
		t.Fatal("last seen was written while another tab is open")
	}
	if got := b.resolve(ctx, []string{alice})[0]; got.State != StateOnline {
		t.Fatalf("got %q, want online", got.State)
	}
}

func TestConnectedHandsTheTabItsOwnStatus(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, statusKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	b.client.Set(ctx, statusKeyPrefix+alice, statusInvisible, time.Minute)

	conn := newFakeConn(alice)
	b.Connected(conn)

	if got := conn.lastSent(); got != `{"type":"presence:self","status":"invisible"}` {
		t.Fatalf("got %q, want the declared status", got)
	}
}

func TestConnectedClearsAnExpiryLeftOnTheStatus(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, statusKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	b.client.Set(ctx, statusKeyPrefix+alice, statusInvisible, time.Minute)

	b.Connected(newFakeConn(alice))

	if ttl := b.client.TTL(ctx, statusKeyPrefix+alice).Val(); ttl >= 0 {
		t.Fatalf("got ttl %v, want none: nothing rewrites the declared status", ttl)
	}
}

func TestConnectedDefaultsToOnlineWhenNothingWasDeclared(t *testing.T) {
	b := testBroker(t)
	ctx := context.Background()
	keys := []string{connsKeyPrefix + alice, statusKeyPrefix + alice}
	b.client.Del(ctx, keys...)
	t.Cleanup(func() { b.client.Del(context.Background(), keys...) })

	conn := newFakeConn(alice)
	b.Connected(conn)

	if got := conn.lastSent(); got != `{"type":"presence:self","status":"online"}` {
		t.Fatalf("got %q, want online", got)
	}
}

// resolve reads the answer after liveInstances has released the lock, so what it hands back
// cannot be the shared cache. Needs no Redis: a reference to this gateway never reaches it.
// Only fails under -race.
func TestLiveInstancesDoesNotShareItsCache(t *testing.T) {
	b := &Broker{
		logger:     slog.New(slog.NewTextHandler(io.Discard, nil)),
		instanceID: "abcdef0123456789",
		live:       make(map[string]bool),
		done:       make(chan struct{}),
	}
	referenced := map[string]struct{}{b.instanceID: {}}

	var wg sync.WaitGroup
	for range 8 {
		wg.Go(func() {
			for range 2000 {
				if live := b.liveInstances(context.Background(), referenced); !live[b.instanceID] {
					t.Error("this gateway read as gone")
					return
				}
			}
		})
	}
	wg.Wait()
}

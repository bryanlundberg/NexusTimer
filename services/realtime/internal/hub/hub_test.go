package hub

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"slices"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

var discardLogger = slog.New(slog.NewTextHandler(io.Discard, nil))

// watchOnInbound treats every frame as a comma separated list of people to follow.
func watchOnInbound(c Conn, payload []byte) { c.Watch(strings.Split(string(payload), ",")) }

type presenceCall struct {
	kind   string
	userID string
}

// recordingPresence greets every new connection, which is what the real one does to hand a
// tab its own declared status.
type recordingPresence struct {
	mu    sync.Mutex
	calls []presenceCall
}

func (p *recordingPresence) Connected(c Conn) {
	p.record(presenceCall{"connected", c.UserID()})
	c.Send([]byte("hello " + c.UserID()))
}

func (p *recordingPresence) Disconnected(userID, _ string) {
	p.record(presenceCall{"disconnected", userID})
}

func (p *recordingPresence) record(call presenceCall) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.calls = append(p.calls, call)
}

func (p *recordingPresence) kinds() []string {
	p.mu.Lock()
	defer p.mu.Unlock()
	kinds := make([]string, len(p.calls))
	for i, call := range p.calls {
		kinds[i] = call.kind
	}
	return kinds
}

func connect(t *testing.T, h *Hub, userID string) *websocket.Conn {
	t.Helper()
	upgrader := websocket.Upgrader{}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		h.Register(userID, conn)
	}))
	t.Cleanup(srv.Close)

	conn, _, err := websocket.DefaultDialer.Dial("ws"+strings.TrimPrefix(srv.URL, "http"), nil)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	t.Cleanup(func() { _ = conn.Close() })
	return conn
}

func waitFor(t *testing.T, condition func() bool) {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	for !condition() {
		if time.Now().After(deadline) {
			t.Fatal("condition not met in time")
		}
		time.Sleep(10 * time.Millisecond)
	}
}

func waitForConnections(t *testing.T, h *Hub, want int64) {
	t.Helper()
	waitFor(t, func() bool { return h.Stats().Connections == want })
}

func read(t *testing.T, conn *websocket.Conn) string {
	t.Helper()
	_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	_, data, err := conn.ReadMessage()
	if err != nil {
		t.Fatalf("read: %v", err)
	}
	return string(data)
}

// readNothing leaves the connection unusable, so it has to be the last read of a test.
func readNothing(t *testing.T, conn *websocket.Conn) {
	t.Helper()
	_ = conn.SetReadDeadline(time.Now().Add(100 * time.Millisecond))
	if _, data, err := conn.ReadMessage(); err == nil {
		t.Fatalf("unexpected frame %q", data)
	}
}

// watchAndWait waits until the hub has applied the frame, which it handles on the
// connection's own goroutine.
func watchAndWait(t *testing.T, h *Hub, conn *websocket.Conn, ids ...string) {
	t.Helper()
	if err := conn.WriteMessage(websocket.TextMessage, []byte(strings.Join(ids, ","))); err != nil {
		t.Fatal(err)
	}
	waitFor(t, func() bool {
		h.mu.RLock()
		defer h.mu.RUnlock()
		for _, id := range ids {
			if len(h.watchers[id]) == 0 {
				return false
			}
		}
		return true
	})
}

func TestDeliverReachesEveryTabOfTheUserInOrder(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	tabA := connect(t, h, "u1")
	tabB := connect(t, h, "u1")
	other := connect(t, h, "u2")
	waitForConnections(t, h, 3)

	h.Deliver("u1", []byte("first"))
	h.Deliver("u1", []byte("second"))

	for _, tab := range []*websocket.Conn{tabA, tabB} {
		if got := read(t, tab) + "," + read(t, tab); got != "first,second" {
			t.Fatalf("got %q, want first,second", got)
		}
	}

	readNothing(t, other)
}

func TestClosedConnectionIsUnregistered(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	tabA := connect(t, h, "u1")
	connect(t, h, "u1")
	waitForConnections(t, h, 2)

	_ = tabA.Close()

	waitFor(t, func() bool { s := h.Stats(); return s.Users == 1 && s.Connections == 1 })
}

func TestSlowClientIsDisconnected(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	connect(t, h, "u1")
	waitForConnections(t, h, 1)

	h.mu.RLock()
	var c *client
	for c = range h.users["u1"] {
	}
	h.mu.RUnlock()

	// Pretend a write is stuck so the queue fills up
	c.mu.Lock()
	c.flushing = true
	c.mu.Unlock()
	for range h.opts.MaxQueue + 1 {
		h.Deliver("u1", []byte("x"))
	}

	waitForConnections(t, h, 0)
}

func TestSilentConnectionIsDropped(t *testing.T) {
	opts := DefaultOptions()
	opts.PingPeriod = 50 * time.Millisecond
	opts.PongWait = 150 * time.Millisecond
	h := New(opts, discardLogger, nil, nil)

	// Never reading means the browser side never answers pings
	connect(t, h, "u1")
	waitForConnections(t, h, 1)

	waitForConnections(t, h, 0)
}

func TestInboundFramesReachTheHandlerThrottled(t *testing.T) {
	type frame struct{ userID, payload string }
	received := make(chan frame, 4)

	opts := DefaultOptions()
	opts.InboundBurst = 1
	opts.InboundRefill = 200 * time.Millisecond
	h := New(opts, discardLogger, nil, func(c Conn, payload []byte) {
		received <- frame{c.UserID(), string(payload)}
	})

	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	for _, payload := range []string{"first", "too-soon"} {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(payload)); err != nil {
			t.Fatal(err)
		}
	}
	time.Sleep(250 * time.Millisecond)
	if err := conn.WriteMessage(websocket.TextMessage, []byte("later")); err != nil {
		t.Fatal(err)
	}

	for _, want := range []frame{{"u1", "first"}, {"u1", "later"}} {
		select {
		case got := <-received:
			if got != want {
				t.Fatalf("got %+v, want %+v", got, want)
			}
		case <-time.After(2 * time.Second):
			t.Fatalf("missing %+v", want)
		}
	}
	select {
	case got := <-received:
		t.Fatalf("throttled frame was delivered: %+v", got)
	default:
	}
}

// A burst is what a page navigation looks like: a watch frame right after a typing frame.
func TestInboundBurstIsNotDropped(t *testing.T) {
	received := make(chan string, 8)

	opts := DefaultOptions()
	opts.InboundBurst = 3
	opts.InboundRefill = time.Hour
	h := New(opts, discardLogger, nil, func(_ Conn, payload []byte) { received <- string(payload) })

	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	for _, payload := range []string{"one", "two", "three", "over-budget"} {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(payload)); err != nil {
			t.Fatal(err)
		}
	}

	for _, want := range []string{"one", "two", "three"} {
		select {
		case got := <-received:
			if got != want {
				t.Fatalf("got %q, want %q", got, want)
			}
		case <-time.After(2 * time.Second):
			t.Fatalf("missing %q", want)
		}
	}
	select {
	case got := <-received:
		t.Fatalf("over budget frame was delivered: %q", got)
	case <-time.After(100 * time.Millisecond):
	}
}

func TestRegisterFollowsTheUserOwnPresence(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	h.Broadcast("u1", []byte("mine"))

	if got := read(t, conn); got != "mine" {
		t.Fatalf("got %q, want mine", got)
	}
}

func TestBroadcastOnlyReachesFollowers(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, watchOnInbound)
	follower := connect(t, h, "u1")
	bystander := connect(t, h, "u2")
	waitForConnections(t, h, 2)

	watchAndWait(t, h, follower, "u3")

	// The watch is answered by the inbound handler in production; here it only registers.
	h.Broadcast("u3", []byte("u3-online"))

	if got := read(t, follower); got != "u3-online" {
		t.Fatalf("got %q, want u3-online", got)
	}
	readNothing(t, bystander)
}

func TestWatchReplacesThePreviousSet(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, watchOnInbound)
	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	watchAndWait(t, h, conn, "u2")
	watchAndWait(t, h, conn, "u3")

	// Both go out in order, so the first frame that arrives says which set is in effect
	h.Broadcast("u2", []byte("stale"))
	h.Broadcast("u3", []byte("current"))

	if got := read(t, conn); got != "current" {
		t.Fatalf("got %q, want current", got)
	}
}

func TestWatchIsCapped(t *testing.T) {
	opts := DefaultOptions()
	opts.MaxWatched = 2
	h := New(opts, discardLogger, nil, watchOnInbound)
	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	ids := make([]string, 50)
	for i := range ids {
		ids[i] = "w" + strconv.Itoa(i)
	}
	if err := conn.WriteMessage(websocket.TextMessage, []byte(strings.Join(ids, ","))); err != nil {
		t.Fatal(err)
	}

	waitFor(t, func() bool {
		h.mu.RLock()
		defer h.mu.RUnlock()
		return len(h.watchers) == opts.MaxWatched
	})

	h.Broadcast(ids[len(ids)-1], []byte("over-cap"))
	readNothing(t, conn)
}

func TestClosingStopsBroadcastsAndClearsWatchers(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, watchOnInbound)
	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)
	watchAndWait(t, h, conn, "u2")

	_ = conn.Close()
	waitForConnections(t, h, 0)

	waitFor(t, func() bool {
		h.mu.RLock()
		defer h.mu.RUnlock()
		return len(h.watchers) == 0
	})
}

func TestPresenceSeesConnectAndDisconnect(t *testing.T) {
	presence := &recordingPresence{}
	h := New(DefaultOptions(), discardLogger, presence, nil)

	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	if got := read(t, conn); got != "hello u1" {
		t.Fatalf("got %q, want hello u1", got)
	}

	_ = conn.Close()
	waitForConnections(t, h, 0)
	waitFor(t, func() bool { return slices.Contains(presence.kinds(), "disconnected") })

	if kinds := presence.kinds(); kinds[0] != "connected" {
		t.Fatalf("first call was %q, want connected", kinds[0])
	}
}

func TestPingDoesNotTouchPresence(t *testing.T) {
	presence := &recordingPresence{}
	opts := DefaultOptions()
	opts.PingPeriod = 20 * time.Millisecond
	h := New(opts, discardLogger, presence, nil)

	connect(t, h, "u1")
	waitForConnections(t, h, 1)
	time.Sleep(150 * time.Millisecond)

	if kinds := presence.kinds(); len(kinds) != 1 {
		t.Fatalf("got %v after several pings, want a single connect", kinds)
	}
}

func TestConnectionsListsEveryOpenTab(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	connect(t, h, "u1")
	connect(t, h, "u1")
	connect(t, h, "u2")
	waitForConnections(t, h, 3)

	conns := h.Connections()
	if len(conns) != 3 {
		t.Fatalf("got %d connections, want 3", len(conns))
	}

	ids := make(map[string]struct{}, len(conns))
	for _, conn := range conns {
		if conn.ConnID == "" {
			t.Fatal("a connection has no id")
		}
		ids[conn.ConnID] = struct{}{}
	}
	if len(ids) != 3 {
		t.Fatalf("got %d distinct ids, want 3", len(ids))
	}
}

func TestCloseAllSendsServiceRestart(t *testing.T) {
	h := New(DefaultOptions(), discardLogger, nil, nil)
	conn := connect(t, h, "u1")
	waitForConnections(t, h, 1)

	h.CloseAll(websocket.CloseServiceRestart, "restarting")

	_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	_, _, err := conn.ReadMessage()
	if !websocket.IsCloseError(err, websocket.CloseServiceRestart) {
		t.Fatalf("got %v, want close 1012", err)
	}
	waitForConnections(t, h, 0)
}

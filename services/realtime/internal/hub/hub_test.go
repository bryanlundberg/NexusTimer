package hub

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

var discardLogger = slog.New(slog.NewTextHandler(io.Discard, nil))

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

func TestDeliverReachesEveryTabOfTheUserInOrder(t *testing.T) {
	h := New(DefaultOptions(), discardLogger)
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

	_ = other.SetReadDeadline(time.Now().Add(100 * time.Millisecond))
	if _, data, err := other.ReadMessage(); err == nil {
		t.Fatalf("other user received %q", data)
	}
}

func TestClosedConnectionIsUnregistered(t *testing.T) {
	h := New(DefaultOptions(), discardLogger)
	tabA := connect(t, h, "u1")
	connect(t, h, "u1")
	waitForConnections(t, h, 2)

	_ = tabA.Close()

	waitFor(t, func() bool { s := h.Stats(); return s.Users == 1 && s.Connections == 1 })
}

func TestSlowClientIsDisconnected(t *testing.T) {
	h := New(DefaultOptions(), discardLogger)
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
	h := New(opts, discardLogger)

	// Never reading means the browser side never answers pings
	connect(t, h, "u1")
	waitForConnections(t, h, 1)

	waitForConnections(t, h, 0)
}

func TestCloseAllSendsServiceRestart(t *testing.T) {
	h := New(DefaultOptions(), discardLogger)
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

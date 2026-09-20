package hub

import (
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

type Options struct {
	WriteWait time.Duration
	PongWait  time.Duration
	// PingPeriod must be shorter than PongWait.
	PingPeriod     time.Duration
	MaxQueue       int
	MaxMessageSize int64
	InboundBurst   int
	InboundRefill  time.Duration
	MaxWatched     int
}

func DefaultOptions() Options {
	return Options{
		WriteWait:      10 * time.Second,
		PongWait:       60 * time.Second,
		PingPeriod:     30 * time.Second,
		MaxQueue:       16,
		MaxMessageSize: 8192,
		InboundBurst:   30,
		InboundRefill:  500 * time.Millisecond,
		MaxWatched:     100,
	}
}

type Conn interface {
	UserID() string
	ConnID() string
	Send(payload []byte)
	Watch(userIDs []string) []string
	SetIdle(idle bool) bool
	Idle() bool
}

type InboundFunc func(c Conn, payload []byte)

type Presence interface {
	Connected(c Conn)
	Disconnected(userID, connID string)
}

type Connection struct {
	UserID string
	ConnID string
	Idle   bool
}

type Stats struct {
	Users       int   `json:"users"`
	Connections int64 `json:"connections"`
}

type Hub struct {
	opts      Options
	logger    *slog.Logger
	onInbound InboundFunc
	presence  Presence

	mu       sync.RWMutex
	users    map[string]map[*client]struct{}
	watchers map[string]map[*client]struct{}
	conns    atomic.Int64
}

func New(opts Options, logger *slog.Logger, presence Presence, onInbound InboundFunc) *Hub {
	return &Hub{
		opts:      opts,
		logger:    logger,
		onInbound: onInbound,
		presence:  presence,
		users:     make(map[string]map[*client]struct{}),
		watchers:  make(map[string]map[*client]struct{}),
	}
}

func (h *Hub) Register(userID string, conn *websocket.Conn) {
	c := newClient(h, userID, conn)
	h.add(c)
	h.watch(c, []string{userID})

	if h.presence != nil {
		h.presence.Connected(c)
	}
	go c.readPump()
}

func (h *Hub) Deliver(userID string, payload []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.users[userID] {
		c.enqueue(payload)
	}
}

func (h *Hub) Broadcast(userID string, payload []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.watchers[userID] {
		c.enqueue(payload)
	}
}

func (h *Hub) Connections() []Connection {
	h.mu.RLock()
	defer h.mu.RUnlock()

	conns := make([]Connection, 0, h.conns.Load())
	for userID, set := range h.users {
		for c := range set {
			conns = append(conns, Connection{UserID: userID, ConnID: c.connID, Idle: c.Idle()})
		}
	}
	return conns
}

func (h *Hub) Stats() Stats {
	h.mu.RLock()
	users := len(h.users)
	h.mu.RUnlock()
	return Stats{Users: users, Connections: h.conns.Load()}
}

func (h *Hub) CloseAll(code int, reason string) {
	h.mu.RLock()
	clients := make([]*client, 0, h.conns.Load())
	for _, set := range h.users {
		for c := range set {
			clients = append(clients, c)
		}
	}
	h.mu.RUnlock()

	frame := websocket.FormatCloseMessage(code, reason)
	deadline := time.Now().Add(time.Second)
	for _, c := range clients {
		_ = c.conn.WriteControl(websocket.CloseMessage, frame, deadline)
		c.close()
	}
}

func (h *Hub) add(c *client) {
	h.mu.Lock()
	set := h.users[c.userID]
	if set == nil {
		set = make(map[*client]struct{})
		h.users[c.userID] = set
	}
	set[c] = struct{}{}
	h.mu.Unlock()
	h.conns.Add(1)
}

func (h *Hub) remove(c *client) {
	h.mu.Lock()
	set := h.users[c.userID]
	if _, ok := set[c]; !ok {
		h.mu.Unlock()
		return
	}
	delete(set, c)
	h.conns.Add(-1)
	if len(set) == 0 {
		delete(h.users, c.userID)
	}
	h.clearWatchedLocked(c)
	h.mu.Unlock()

	if h.presence != nil {
		h.presence.Disconnected(c.userID, c.connID)
	}
}

func (h *Hub) watch(c *client, userIDs []string) []string {
	if h.opts.MaxWatched > 0 && len(userIDs) > h.opts.MaxWatched {
		userIDs = userIDs[:h.opts.MaxWatched]
	}

	h.mu.Lock()
	defer h.mu.Unlock()
	h.clearWatchedLocked(c)
	c.watched = make(map[string]struct{}, len(userIDs))
	for _, id := range userIDs {
		c.watched[id] = struct{}{}
		set := h.watchers[id]
		if set == nil {
			set = make(map[*client]struct{})
			h.watchers[id] = set
		}
		set[c] = struct{}{}
	}
	return userIDs
}

func (h *Hub) clearWatchedLocked(c *client) {
	for id := range c.watched {
		set := h.watchers[id]
		delete(set, c)
		if len(set) == 0 {
			delete(h.watchers, id)
		}
	}
	c.watched = nil
}

// Package hub keeps track of open WebSocket connections per user and delivers messages to them.
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
	PingPeriod time.Duration
	// MaxQueue undelivered messages before a client gets disconnected.
	MaxQueue       int
	MaxMessageSize int64
	// InboundBurst frames a client may send back to back, refilled one every InboundRefill.
	InboundBurst  int
	InboundRefill time.Duration
	// MaxWatched people a single connection may follow the presence of.
	MaxWatched int
}

func DefaultOptions() Options {
	return Options{
		WriteWait:  10 * time.Second,
		PongWait:   60 * time.Second,
		PingPeriod: 30 * time.Second,
		MaxQueue:   16,
		// A presence watch carries up to MaxWatched ids of 24 characters each.
		MaxMessageSize: 8192,
		InboundBurst:   10,
		InboundRefill:  time.Second,
		MaxWatched:     100,
	}
}

// Conn is what an inbound handler may do with the connection a frame arrived on.
type Conn interface {
	UserID() string
	ConnID() string
	Send(payload []byte)
	// Watch replaces the followed set and returns the ids that were kept, since the hub caps
	// how many a single connection may follow.
	Watch(userIDs []string) []string
	// SetIdle reports whether the flag actually changed.
	SetIdle(idle bool) bool
	Idle() bool
}

// InboundFunc handles a frame sent by a browser.
type InboundFunc func(c Conn, payload []byte)

// Presence records connection state where every instance can read it. Implementations are
// called from connection goroutines, so they should return quickly.
type Presence interface {
	// Connected may also write back to the connection, which is how a tab learns its own status.
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

	mu    sync.RWMutex
	users map[string]map[*client]struct{}
	// watchers is the reverse of every connection's watch set: who to notify about whom.
	watchers map[string]map[*client]struct{}
	conns    atomic.Int64
}

// New accepts a nil presence and a nil onInbound.
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

// Register takes ownership of an upgraded connection until it closes.
func (h *Hub) Register(userID string, conn *websocket.Conn) {
	c := newClient(h, userID, conn)
	h.add(c)
	// A tab always follows itself, so it shows the same state everyone else sees
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

// Connections lets the presence store rewrite every open tab after Redis was unreachable.
// Nothing else refreshes them.
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

// watch replaces the connection's watch set. c.watched is guarded by h.mu, not by c.mu.
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

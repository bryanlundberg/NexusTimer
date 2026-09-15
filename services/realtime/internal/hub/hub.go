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
}

func DefaultOptions() Options {
	return Options{
		WriteWait:      10 * time.Second,
		PongWait:       60 * time.Second,
		PingPeriod:     30 * time.Second,
		MaxQueue:       16,
		MaxMessageSize: 1024,
	}
}

type Stats struct {
	Users       int   `json:"users"`
	Connections int64 `json:"connections"`
}

type Hub struct {
	opts   Options
	logger *slog.Logger

	mu    sync.RWMutex
	users map[string]map[*client]struct{}
	conns atomic.Int64
}

func New(opts Options, logger *slog.Logger) *Hub {
	return &Hub{
		opts:   opts,
		logger: logger,
		users:  make(map[string]map[*client]struct{}),
	}
}

// Register takes ownership of an upgraded connection until it closes.
func (h *Hub) Register(userID string, conn *websocket.Conn) {
	c := newClient(h, userID, conn)
	h.add(c)
	go c.readPump()
}

func (h *Hub) Deliver(userID string, payload []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.users[userID] {
		c.enqueue(payload)
	}
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
	defer h.mu.Unlock()
	set := h.users[c.userID]
	if _, ok := set[c]; !ok {
		return
	}
	delete(set, c)
	h.conns.Add(-1)
	if len(set) == 0 {
		delete(h.users, c.userID)
	}
}

package hub

import (
	"crypto/rand"
	"encoding/hex"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// client costs one goroutine while idle (the reader). Writes run on a short-lived
// goroutine only while messages are queued, and pings run on a timer.
type client struct {
	hub    *Hub
	userID string
	connID string
	conn   *websocket.Conn

	mu        sync.Mutex
	queue     [][]byte
	flushing  bool
	closed    bool
	idle      bool
	pingTimer *time.Timer

	// watched is guarded by hub.mu, since the hub keeps the reverse index.
	watched map[string]struct{}

	// Only touched by readPump.
	tokens     float64
	lastRefill time.Time
}

func newClient(h *Hub, userID string, conn *websocket.Conn) *client {
	c := &client{
		hub:        h,
		userID:     userID,
		connID:     newConnID(),
		conn:       conn,
		tokens:     float64(h.opts.InboundBurst),
		lastRefill: time.Now(),
	}
	c.pingTimer = time.AfterFunc(h.opts.PingPeriod, c.ping)
	return c
}

func newConnID() string {
	var buf [8]byte
	if _, err := rand.Read(buf[:]); err != nil {
		return strconv.FormatInt(time.Now().UnixNano(), 36)
	}
	return hex.EncodeToString(buf[:])
}

func (c *client) UserID() string { return c.userID }

func (c *client) ConnID() string { return c.connID }

func (c *client) Send(payload []byte) { c.enqueue(payload) }

func (c *client) Watch(userIDs []string) []string { return c.hub.watch(c, userIDs) }

func (c *client) Idle() bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.idle
}

func (c *client) SetIdle(idle bool) bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.idle == idle {
		return false
	}
	c.idle = idle
	return true
}

// enqueue never blocks: a client that falls behind is disconnected instead of slowing others down.
func (c *client) enqueue(payload []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.closed {
		return
	}
	if len(c.queue) >= c.hub.opts.MaxQueue {
		c.hub.logger.Warn("dropping slow client", "user", c.userID)
		c.closeLocked()
		return
	}
	c.queue = append(c.queue, payload)
	if !c.flushing {
		c.flushing = true
		go c.flush()
	}
}

// flush is the only data writer, which keeps messages in order.
func (c *client) flush() {
	for {
		c.mu.Lock()
		if c.closed || len(c.queue) == 0 {
			c.flushing = false
			c.queue = nil
			c.mu.Unlock()
			return
		}
		payload := c.queue[0]
		c.queue = c.queue[1:]
		c.mu.Unlock()

		_ = c.conn.SetWriteDeadline(time.Now().Add(c.hub.opts.WriteWait))
		if err := c.conn.WriteMessage(websocket.TextMessage, payload); err != nil {
			c.close()
			return
		}
	}
}

// ping deliberately does not refresh presence: the gateway's own lease covers the same
// failure for one write per instance instead of one per connection.
func (c *client) ping() {
	deadline := time.Now().Add(c.hub.opts.WriteWait)
	if err := c.conn.WriteControl(websocket.PingMessage, nil, deadline); err != nil {
		c.close()
		return
	}
	c.mu.Lock()
	if !c.closed {
		c.pingTimer.Reset(c.hub.opts.PingPeriod)
	}
	c.mu.Unlock()
}

func (c *client) close() {
	c.mu.Lock()
	c.closeLocked()
	c.mu.Unlock()
}

// closeLocked closes the socket, which unblocks readPump so it unregisters the client.
func (c *client) closeLocked() {
	if c.closed {
		return
	}
	c.closed = true
	c.queue = nil
	c.pingTimer.Stop()
	_ = c.conn.Close()
}

func (c *client) readPump() {
	defer func() {
		c.hub.remove(c)
		c.close()
	}()

	c.conn.SetReadLimit(c.hub.opts.MaxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(c.hub.opts.PongWait))
	c.conn.SetPongHandler(func(string) error {
		return c.conn.SetReadDeadline(time.Now().Add(c.hub.opts.PongWait))
	})

	for {
		_, payload, err := c.conn.ReadMessage()
		if err != nil {
			return
		}
		c.receive(payload)
	}
}

func (c *client) receive(payload []byte) {
	if c.hub.onInbound == nil || !c.takeToken() {
		return
	}
	c.hub.onInbound(c, payload)
}

// takeToken spends one token from the bucket, so a socket can burst but cannot flood Redis.
func (c *client) takeToken() bool {
	now := time.Now()
	refill := c.hub.opts.InboundRefill
	if refill > 0 {
		c.tokens += now.Sub(c.lastRefill).Seconds() / refill.Seconds()
		if limit := float64(c.hub.opts.InboundBurst); c.tokens > limit {
			c.tokens = limit
		}
	}
	c.lastRefill = now

	if c.tokens < 1 {
		return false
	}
	c.tokens--
	return true
}

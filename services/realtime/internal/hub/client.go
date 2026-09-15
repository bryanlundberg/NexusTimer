package hub

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// client costs one goroutine while idle (the reader). Writes run on a short-lived
// goroutine only while messages are queued, and pings run on a timer.
type client struct {
	hub    *Hub
	userID string
	conn   *websocket.Conn

	mu        sync.Mutex
	queue     [][]byte
	flushing  bool
	closed    bool
	pingTimer *time.Timer
}

func newClient(h *Hub, userID string, conn *websocket.Conn) *client {
	c := &client{hub: h, userID: userID, conn: conn}
	c.pingTimer = time.AfterFunc(h.opts.PingPeriod, c.ping)
	return c
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
		if _, _, err := c.conn.NextReader(); err != nil {
			return
		}
	}
}

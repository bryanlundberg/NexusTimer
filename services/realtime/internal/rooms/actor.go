package rooms

import (
	"context"
	"encoding/json"
	"runtime/debug"
	"time"

	"nexustimer/realtime/internal/hub"
)

const (
	inboxSize       = 64
	storeTimeout    = 2 * time.Second
	scrambleTimeout = 5 * time.Second
	maxScrambleWait = 30 * time.Second
)

type envelope struct {
	input Input
	conn  hub.Conn
}

// actor owns one room: every input goes through its inbox, so the room never needs a lock.
type actor struct {
	m     *Manager
	room  *Room
	conns map[string]hub.Conn
	inbox chan envelope
	done  chan struct{}

	scrambleFailures int
	crashed          bool
}

func newActor(m *Manager, room *Room) *actor {
	return &actor{
		m:     m,
		room:  room,
		conns: map[string]hub.Conn{},
		inbox: make(chan envelope, inboxSize),
		done:  make(chan struct{}),
	}
}

func (a *actor) run(ctx context.Context) {
	defer close(a.done)
	timer := time.NewTimer(time.Hour)
	defer timer.Stop()

	for {
		a.schedule(timer)
		select {
		case <-ctx.Done():
			return
		case env := <-a.inbox:
			a.step(ctx, env)
		case <-timer.C:
			a.step(ctx, envelope{input: Tick{}})
		}
		if a.crashed || a.room.Closed() {
			a.refuseQueued()
			return
		}
	}
}

func (a *actor) schedule(timer *time.Timer) {
	wake := a.room.NextWake()
	if wake.IsZero() {
		timer.Stop()
		return
	}
	timer.Reset(max(wake.Sub(a.m.now()), 0))
}

func (a *actor) deliver(env envelope) bool {
	select {
	case <-a.done:
		return false
	default:
	}
	select {
	case a.inbox <- env:
		return true
	case <-a.done:
		return false
	}
}

// refuseQueued answers joins that were already queued when the room went away.
func (a *actor) refuseQueued() {
	for {
		select {
		case env := <-a.inbox:
			if join, ok := env.input.(Join); ok && env.conn != nil {
				a.m.sendError(env.conn, join.Rid, a.room.ID(), ErrNotFound)
			}
		default:
			return
		}
	}
}

func (a *actor) step(ctx context.Context, env envelope) {
	defer func() {
		if p := recover(); p != nil {
			a.m.logger.Error("room crashed", "room", a.room.ID(), "panic", p, "stack", string(debug.Stack()))
			a.crash(ctx)
		}
	}()

	if moved, ok := env.input.(Moved); ok && a.m.seatRoom(moved.UserID) == a.room.ID() {
		return
	}
	if env.conn != nil {
		a.conns[env.conn.ConnID()] = env.conn
	}
	switch env.input.(type) {
	case AddScrambles:
		a.scrambleFailures = 0
	case ScramblesFailed:
		a.scrambleFailures++
	}

	version := a.room.Version()
	a.apply(ctx, a.room.Step(env.input, a.m.now()))
	if join, ok := env.input.(Join); ok && a.room.Seated(join.UserID, join.ConnID) {
		a.m.seated(join.UserID, join.ConnID, a.room.ID())
	}
	a.forgetConns()
	if !a.room.Closed() && a.room.Version() != version {
		a.persist(ctx)
	}
}

func (a *actor) apply(ctx context.Context, fx []Effect) {
	lobby := false
	for _, effect := range fx {
		switch e := effect.(type) {
		case Send:
			if c := a.conns[e.ConnID]; c != nil {
				if raw, ok := a.encode(e.Event); ok {
					c.Send(raw)
				}
			}
		case Broadcast:
			raw, ok := a.encode(e.Event)
			if !ok {
				continue
			}
			for _, id := range e.To {
				if c := a.conns[id]; c != nil {
					c.Send(raw)
				}
			}
		case SeatFreed:
			a.m.freed(e.UserID, a.room.ID())
		case NeedScrambles:
			a.fetchScrambles(ctx, e.Count)
		case LobbyChanged:
			lobby = true
		case Closed:
			a.m.removeRoom(a.room.ID())
			a.deleteState(ctx)
			return
		}
	}
	if lobby {
		a.m.updateSummary(a.room.Summary())
	}
}

func (a *actor) encode(event any) ([]byte, bool) {
	raw, err := json.Marshal(event)
	if err != nil {
		a.m.logger.Error("encoding room event failed", "room", a.room.ID(), "error", err)
		return nil, false
	}
	return raw, true
}

func (a *actor) forgetConns() {
	for id := range a.conns {
		if p := a.room.state.playerByConn(id); p == nil {
			delete(a.conns, id)
		}
	}
}

// fetchScrambles backs off after failures: 2 s, 4 s, 8 s and so on up to 30 s between attempts.
func (a *actor) fetchScrambles(ctx context.Context, count int) {
	event := a.room.state.Settings.Event
	roomID := a.room.ID()
	var wait time.Duration
	if a.scrambleFailures > 0 {
		wait = min(a.m.retryBase<<min(a.scrambleFailures, 5), maxScrambleWait)
	}

	go func() {
		if wait > 0 {
			select {
			case <-time.After(wait):
			case <-ctx.Done():
				return
			}
		}
		request, cancel := context.WithTimeout(ctx, scrambleTimeout)
		scrambles, err := a.m.scrambles.Scrambles(request, event, count)
		cancel()
		if err != nil {
			a.m.logger.Warn("fetching scrambles failed", "room", roomID, "error", err)
			a.deliver(envelope{input: ScramblesFailed{}})
			return
		}
		a.deliver(envelope{input: AddScrambles{Scrambles: scrambles}})
	}()
}

func (a *actor) persist(ctx context.Context) {
	save, cancel := context.WithTimeout(ctx, storeTimeout)
	defer cancel()
	if err := a.m.store.Save(save, a.room.State()); err != nil {
		a.m.logger.Warn("saving room failed", "room", a.room.ID(), "error", err)
	}
}

func (a *actor) deleteState(ctx context.Context) {
	remove, cancel := context.WithTimeout(context.WithoutCancel(ctx), storeTimeout)
	defer cancel()
	if err := a.m.store.Delete(remove, a.room.ID()); err != nil {
		a.m.logger.Warn("deleting room failed", "room", a.room.ID(), "error", err)
	}
}

// crash closes only this room: its players are told it is gone and the rest of the gateway keeps running.
func (a *actor) crash(ctx context.Context) {
	a.crashed = true
	if raw, ok := a.encode(ClosedEvent{Type: "room:closed", RoomID: a.room.ID()}); ok {
		for _, c := range a.conns {
			c.Send(raw)
		}
	}
	a.m.removeRoom(a.room.ID())
	a.deleteState(ctx)
}

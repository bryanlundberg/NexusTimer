package rooms

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"sync"
	"testing"
	"time"
)

type testConn struct {
	userID string
	connID string

	mu     sync.Mutex
	frames []map[string]any
}

func newTestConn(userID string) *testConn {
	return &testConn{userID: userID, connID: "conn-" + userID}
}

func (c *testConn) UserID() string          { return c.userID }
func (c *testConn) ConnID() string          { return c.connID }
func (c *testConn) Name() string            { return c.userID }
func (c *testConn) Image() string           { return "" }
func (c *testConn) Watch([]string) []string { return nil }
func (c *testConn) Idle() bool              { return false }
func (c *testConn) SetIdle(bool) bool       { return false }

func (c *testConn) Send(payload []byte) {
	var frame map[string]any
	if json.Unmarshal(payload, &frame) != nil {
		return
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	c.frames = append(c.frames, frame)
}

func (c *testConn) find(match func(map[string]any) bool) map[string]any {
	c.mu.Lock()
	defer c.mu.Unlock()
	for _, frame := range c.frames {
		if match(frame) {
			return frame
		}
	}
	return nil
}

func (c *testConn) waitFor(t *testing.T, kind string, match func(map[string]any) bool) map[string]any {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) {
		frame := c.find(func(f map[string]any) bool { return f["type"] == kind && (match == nil || match(f)) })
		if frame != nil {
			return frame
		}
		time.Sleep(5 * time.Millisecond)
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	t.Fatalf("%s never received %s; got %v", c.connID, kind, c.frames)
	return nil
}

type memoryStore struct {
	mu     sync.Mutex
	states map[string][]byte
	lobby  []SummaryView
}

func newMemoryStore() *memoryStore { return &memoryStore{states: map[string][]byte{}} }

func (s *memoryStore) Save(_ context.Context, state State) error {
	raw, err := json.Marshal(state)
	if err != nil {
		return err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.states[state.ID] = raw
	return nil
}

func (s *memoryStore) Delete(_ context.Context, roomID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.states, roomID)
	return nil
}

func (s *memoryStore) LoadAll(context.Context) ([]State, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var states []State
	for _, raw := range s.states {
		var state State
		if err := json.Unmarshal(raw, &state); err != nil {
			return nil, err
		}
		states = append(states, state)
	}
	return states, nil
}

func (s *memoryStore) SaveLobby(_ context.Context, rooms []SummaryView) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.lobby = rooms
	return nil
}

func (s *memoryStore) has(roomID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.states[roomID]
	return ok
}

func (s *memoryStore) lobbySize() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.lobby)
}

type fakeScrambles struct {
	mu       sync.Mutex
	failures int
	served   int
}

func (f *fakeScrambles) Scrambles(_ context.Context, event string, count int) ([]string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.failures > 0 {
		f.failures--
		return nil, errors.New("api unavailable")
	}
	scrambles := make([]string, count)
	for i := range scrambles {
		f.served++
		scrambles[i] = fmt.Sprintf("%s #%d", event, f.served)
	}
	return scrambles, nil
}

func startManager(t *testing.T, store Store, scrambles ScrambleSource) *Manager {
	t.Helper()
	cfg := DefaultConfig()
	cfg.DisconnectGrace = 100 * time.Millisecond
	cfg.EmptyTTL = 150 * time.Millisecond
	cfg.RoundBreak = 50 * time.Millisecond

	m := NewManager(cfg, store, scrambles, slog.New(slog.NewTextHandler(io.Discard, nil)))
	m.lobbyInterval = 10 * time.Millisecond
	m.retryBase = 10 * time.Millisecond
	ctx, cancel := context.WithCancel(context.Background())
	m.Start(ctx)
	t.Cleanup(func() {
		cancel()
		m.Wait()
	})
	return m
}

func send(t *testing.T, m *Manager, c *testConn, frame map[string]any) {
	t.Helper()
	raw, _ := json.Marshal(frame)
	if !m.Inbound(c, raw) {
		t.Fatalf("frame %v was not handled", frame)
	}
}

func createRoom(t *testing.T, m *Manager, c *testConn, private bool) string {
	t.Helper()
	send(t, m, c, map[string]any{"type": "room:create", "rid": 1, "name": "Sala", "event": "3x3", "maxRoundTime": 60, "private": private})
	return c.waitFor(t, "room:created", nil)["roomId"].(string)
}

func joinRoom(t *testing.T, m *Manager, c *testConn, roomID string) map[string]any {
	t.Helper()
	send(t, m, c, map[string]any{"type": "room:join", "rid": 2, "roomId": roomID, "protocol": ProtocolVersion})
	return c.waitFor(t, "room:snapshot", func(f map[string]any) bool { return f["room"].(map[string]any)["roomId"] == roomID })
}

func hasScramble(f map[string]any) bool { return f["round"].(map[string]any)["scramble"] != nil }

func eventually(t *testing.T, what string, check func() bool) {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	for !check() {
		if time.Now().After(deadline) {
			t.Fatalf("timed out waiting for %s", what)
		}
		time.Sleep(5 * time.Millisecond)
	}
}

func TestCreateFetchScramblesJoinAndSolve(t *testing.T) {
	store := newMemoryStore()
	m := startManager(t, store, &fakeScrambles{})
	ana, ben := newTestConn("ana"), newTestConn("ben")

	roomID := createRoom(t, m, ana, false)
	ana.waitFor(t, "room:round", hasScramble)
	if !store.has(roomID) {
		t.Fatal("the new room was not saved")
	}

	snapshot := joinRoom(t, m, ben, roomID)["room"].(map[string]any)
	if snapshot["leaderId"] != "ana" || len(snapshot["players"].([]any)) != 2 {
		t.Fatalf("snapshot = %v", snapshot)
	}
	ana.waitFor(t, "room:members", func(f map[string]any) bool { return len(f["players"].([]any)) == 2 })

	round := int(snapshot["round"].(map[string]any)["index"].(float64))
	send(t, m, ben, map[string]any{"type": "room:solve", "rid": 3, "roomId": roomID, "round": round, "time": 1})
	ana.waitFor(t, "room:solve", func(f map[string]any) bool { return f["solve"].(map[string]any)["userId"] == "ben" })
}

func TestOtherFramesAreLeftForTheBroker(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	c := newTestConn("ana")

	for _, payload := range []string{`{"type":"typing","to":"x","chatId":"y"}`, `{"type":"presence:watch"}`, `not json`} {
		if m.Inbound(c, []byte(payload)) {
			t.Errorf("rooms took %s", payload)
		}
	}
}

func TestJoiningAMissingRoomAnswersNotFound(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	c := newTestConn("ana")

	send(t, m, c, map[string]any{"type": "room:join", "rid": 4, "roomId": "nope", "protocol": ProtocolVersion})

	c.waitFor(t, "room:error", func(f map[string]any) bool { return f["code"] == "not-found" && f["rid"] == float64(4) })
}

func TestInvalidSettingsAreRefused(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	c := newTestConn("ana")

	send(t, m, c, map[string]any{"type": "room:create", "rid": 6, "name": "Sala", "event": "square1", "maxRoundTime": 60})

	c.waitFor(t, "room:error", func(f map[string]any) bool { return f["code"] == "invalid" && f["rid"] == float64(6) })
}

func TestAPrivateRoomGivesItsCodeToMembers(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	ana, ben := newTestConn("ana"), newTestConn("ben")
	roomID := createRoom(t, m, ana, true)

	code := joinRoom(t, m, ana, roomID)["room"].(map[string]any)["code"].(string)
	if len(code) != codeLength {
		t.Fatalf("code = %q", code)
	}

	send(t, m, ben, map[string]any{"type": "room:join", "rid": 5, "roomId": roomID, "protocol": ProtocolVersion})
	ben.waitFor(t, "room:error", func(f map[string]any) bool { return f["code"] == "wrong-code" })
	send(t, m, ben, map[string]any{"type": "room:join", "rid": 6, "roomId": roomID, "protocol": ProtocolVersion, "code": code})
	ben.waitFor(t, "room:snapshot", nil)
}

func TestTheSeatFollowsTheAccountToAnotherRoom(t *testing.T) {
	store := newMemoryStore()
	m := startManager(t, store, &fakeScrambles{})
	ana, ben := newTestConn("ana"), newTestConn("ben")
	first := createRoom(t, m, ana, false)
	second := createRoom(t, m, ben, false)

	joinRoom(t, m, ana, second)

	ana.waitFor(t, "room:replaced", func(f map[string]any) bool { return f["roomId"] == first && f["toRoomId"] == second })
	eventually(t, "the abandoned room to close", func() bool { return !store.has(first) })
	if got := m.seatRoom("ana"); got != second {
		t.Fatalf("ana is seated in %q, want %q", got, second)
	}
}

func TestADisconnectedCreatorLeavesAndTheEmptyRoomCloses(t *testing.T) {
	store := newMemoryStore()
	m := startManager(t, store, &fakeScrambles{})
	ana, ben := newTestConn("ana"), newTestConn("ben")
	roomID := createRoom(t, m, ana, false)
	eventually(t, "the lobby to list the room", func() bool { return store.lobbySize() == 1 })

	m.Disconnected("ana", ana.ConnID())

	eventually(t, "the room to close", func() bool { return !store.has(roomID) })
	eventually(t, "the lobby to drop the room", func() bool { return store.lobbySize() == 0 })
	send(t, m, ben, map[string]any{"type": "room:join", "rid": 7, "roomId": roomID, "protocol": ProtocolVersion})
	ben.waitFor(t, "room:error", func(f map[string]any) bool { return f["code"] == "not-found" })
}

func TestLobbyWatchersGetTheListAndItsChanges(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	carl, ana := newTestConn("carl"), newTestConn("ana")

	send(t, m, carl, map[string]any{"type": "rooms:watch", "rid": 8})
	carl.waitFor(t, "rooms:lobby", func(f map[string]any) bool { return f["rid"] == float64(8) && len(f["rooms"].([]any)) == 0 })

	roomID := createRoom(t, m, ana, false)

	carl.waitFor(t, "rooms:lobby", func(f map[string]any) bool {
		rooms := f["rooms"].([]any)
		return len(rooms) == 1 && rooms[0].(map[string]any)["roomId"] == roomID
	})
}

func TestSavedRoomsComeBackOnStart(t *testing.T) {
	store := newMemoryStore()
	room, _ := New(DefaultConfig(), "saved123", Settings{Name: "Sala", Event: "3x3", MaxRoundTime: 60}, joinAs("ana"), []string{"S1", "S2", "S3", "S4"}, time.Now())
	if err := store.Save(context.Background(), room.State()); err != nil {
		t.Fatal(err)
	}
	m := startManager(t, store, &fakeScrambles{})
	ana := newTestConn("ana")

	snapshot := joinRoom(t, m, ana, "saved123")["room"].(map[string]any)

	if snapshot["leaderId"] != "ana" || snapshot["round"].(map[string]any)["scramble"] != "S1" {
		t.Fatalf("snapshot = %v", snapshot)
	}
}

func TestFailedScrambleRequestsAreRetried(t *testing.T) {
	m := startManager(t, newMemoryStore(), &fakeScrambles{failures: 2})
	ana := newTestConn("ana")

	createRoom(t, m, ana, false)

	ana.waitFor(t, "room:round", hasScramble)
}

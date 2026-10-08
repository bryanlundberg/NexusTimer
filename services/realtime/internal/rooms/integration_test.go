package rooms

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"

	"nexustimer/realtime/internal/auth"
	"nexustimer/realtime/internal/config"
	"nexustimer/realtime/internal/hub"
	"nexustimer/realtime/internal/server"
)

type okPinger struct{}

func (okPinger) Ping(context.Context) error { return nil }

func dialGateway(t *testing.T, srv *httptest.Server, id auth.Identity) *websocket.Conn {
	t.Helper()
	ticket := auth.NewTicket(id, []byte("integration-secret"), time.Now().Add(time.Minute))
	conn, _, err := websocket.DefaultDialer.Dial("ws"+strings.TrimPrefix(srv.URL, "http")+"/?ticket="+ticket, nil)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	t.Cleanup(func() { _ = conn.Close() })
	return conn
}

func write(t *testing.T, conn *websocket.Conn, frame map[string]any) {
	t.Helper()
	if err := conn.WriteJSON(frame); err != nil {
		t.Fatalf("write: %v", err)
	}
}

func readUntil(t *testing.T, conn *websocket.Conn, kind string, match func(map[string]any) bool) map[string]any {
	t.Helper()
	_ = conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	for {
		_, raw, err := conn.ReadMessage()
		if err != nil {
			t.Fatalf("waiting for %s: %v", kind, err)
		}
		var frame map[string]any
		if json.Unmarshal(raw, &frame) == nil && frame["type"] == kind && (match == nil || match(frame)) {
			return frame
		}
	}
}

func TestRoomsOverRealWebSockets(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	m := startManager(t, newMemoryStore(), &fakeScrambles{})
	h := hub.New(hub.DefaultOptions(), logger, hub.Observe(m), func(c hub.Conn, payload []byte) { m.Inbound(c, payload) })
	cfg := config.Config{Secret: []byte("integration-secret")}
	srv := httptest.NewServer(server.New(cfg, h, okPinger{}, logger).Handler())
	t.Cleanup(srv.Close)

	ana := dialGateway(t, srv, auth.Identity{UserID: "ana", Name: "Ana", Image: "https://cdn.example.test/ana.png"})
	write(t, ana, map[string]any{"type": "room:create", "rid": 1, "name": "Sala", "event": "3x3", "maxRoundTime": 60, "private": false})
	roomID := readUntil(t, ana, "room:created", nil)["roomId"].(string)
	readUntil(t, ana, "room:round", hasScramble)

	ben := dialGateway(t, srv, auth.Identity{UserID: "ben", Name: "Ben"})
	write(t, ben, map[string]any{"type": "room:join", "rid": 2, "roomId": roomID, "protocol": ProtocolVersion})
	snapshot := readUntil(t, ben, "room:snapshot", nil)["room"].(map[string]any)

	players := snapshot["players"].([]any)
	first, second := players[0].(map[string]any), players[1].(map[string]any)
	if first["name"] != "Ana" || first["image"] != "https://cdn.example.test/ana.png" || second["name"] != "Ben" || second["image"] != nil {
		t.Fatalf("players = %v", players)
	}

	_ = ben.Close()

	offline := readUntil(t, ana, "room:player", func(f map[string]any) bool { return f["player"].(map[string]any)["userId"] == "ben" })
	if offline["player"].(map[string]any)["online"] != false {
		t.Fatalf("ben still online: %v", offline)
	}
}

package server

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"

	"nexustimer/realtime/internal/auth"
	"nexustimer/realtime/internal/config"
	"nexustimer/realtime/internal/hub"
)

const (
	testSecret    = "test-secret"
	allowedOrigin = "https://app.test"
)

type fakePinger struct{ err error }

func (f fakePinger) Ping(context.Context) error { return f.err }

func newTestServer(t *testing.T, redis Pinger) (*hub.Hub, *httptest.Server) {
	t.Helper()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	h := hub.New(hub.DefaultOptions(), logger, nil, nil)
	cfg := config.Config{Secret: []byte(testSecret), AllowedOrigins: []string{allowedOrigin}}

	srv := httptest.NewServer(New(cfg, h, redis, logger).Handler())
	t.Cleanup(srv.Close)
	return h, srv
}

func dial(srv *httptest.Server, ticket, origin string) (*websocket.Conn, *http.Response, error) {
	url := "ws" + strings.TrimPrefix(srv.URL, "http") + "/?ticket=" + ticket
	return websocket.DefaultDialer.Dial(url, http.Header{"Origin": {origin}})
}

func validTicket(userID string) string {
	return auth.NewTicket(userID, []byte(testSecret), time.Now().Add(time.Minute))
}

func TestWebSocketRejectsForeignOrigin(t *testing.T) {
	_, srv := newTestServer(t, fakePinger{})

	_, res, err := dial(srv, validTicket("u1"), "https://evil.test")
	if err == nil || res == nil || res.StatusCode != http.StatusForbidden {
		t.Fatalf("want 403, got err=%v res=%v", err, res)
	}
}

func TestWebSocketRejectsInvalidTicket(t *testing.T) {
	_, srv := newTestServer(t, fakePinger{})

	for name, ticket := range map[string]string{
		"forged":  "forged.sig",
		"expired": auth.NewTicket("u1", []byte(testSecret), time.Now().Add(-time.Second)),
		"missing": "",
	} {
		t.Run(name, func(t *testing.T) {
			_, res, err := dial(srv, ticket, allowedOrigin)
			if err == nil || res == nil || res.StatusCode != http.StatusUnauthorized {
				t.Fatalf("want 401, got err=%v res=%v", err, res)
			}
		})
	}
}

func TestWebSocketDeliversEventsToTheTicketOwner(t *testing.T) {
	h, srv := newTestServer(t, fakePinger{})

	conn, _, err := dial(srv, validTicket("u1"), allowedOrigin)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer conn.Close()

	deadline := time.Now().Add(2 * time.Second)
	for h.Stats().Connections != 1 && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}

	h.Deliver("u1", []byte(`{"type":"friend:request","userId":"u2"}`))

	_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	_, data, err := conn.ReadMessage()
	if err != nil || string(data) != `{"type":"friend:request","userId":"u2"}` {
		t.Fatalf("got (%q, %v)", data, err)
	}
}

func TestHealthReportsRedisStatus(t *testing.T) {
	for name, tc := range map[string]struct {
		redis      Pinger
		wantStatus int
		wantRedis  bool
	}{
		"redis up":   {fakePinger{}, http.StatusOK, true},
		"redis down": {fakePinger{errors.New("down")}, http.StatusServiceUnavailable, false},
	} {
		t.Run(name, func(t *testing.T) {
			_, srv := newTestServer(t, tc.redis)

			res, err := http.Get(srv.URL + "/health")
			if err != nil {
				t.Fatal(err)
			}
			defer res.Body.Close()

			var body healthResponse
			if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
				t.Fatal(err)
			}
			if res.StatusCode != tc.wantStatus || body.Redis != tc.wantRedis {
				t.Fatalf("got status %d redis %v, want %d %v", res.StatusCode, body.Redis, tc.wantStatus, tc.wantRedis)
			}
		})
	}
}

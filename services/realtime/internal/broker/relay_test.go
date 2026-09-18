package broker

import (
	"context"
	"io"
	"log/slog"
	"os"
	"sync"
	"testing"
	"time"
)

const (
	alice = "64b7f0c2a1b2c3d4e5f60718"
	bob   = "64b7f0c2a1b2c3d4e5f60719"
	carol = "64b7f0c2a1b2c3d4e5f6071a"
	chat  = "64b7f0c2a1b2c3d4e5f6071b"
)

type fakeConn struct {
	userID string
	connID string

	mu      sync.Mutex
	sent    [][]byte
	watched []string
	idle    bool
}

func newFakeConn(userID string) *fakeConn {
	return &fakeConn{userID: userID, connID: "conn-" + userID}
}

func (c *fakeConn) UserID() string { return c.userID }
func (c *fakeConn) ConnID() string { return c.connID }

func (c *fakeConn) Send(payload []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.sent = append(c.sent, payload)
}

func (c *fakeConn) Watch(userIDs []string) []string {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.watched = userIDs
	return userIDs
}

func (c *fakeConn) Idle() bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.idle
}

func (c *fakeConn) SetIdle(idle bool) bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.idle == idle {
		return false
	}
	c.idle = idle
	return true
}

func (c *fakeConn) watching() []string {
	c.mu.Lock()
	defer c.mu.Unlock()
	return append([]string(nil), c.watched...)
}

func (c *fakeConn) lastSent() string {
	c.mu.Lock()
	defer c.mu.Unlock()
	if len(c.sent) == 0 {
		return ""
	}
	return string(c.sent[len(c.sent)-1])
}

func testBroker(t *testing.T) *Broker {
	t.Helper()
	url := os.Getenv("REDIS_TEST_URL")
	if url == "" {
		t.Skip("REDIS_TEST_URL not set")
	}

	b, err := New(url, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = b.Close() })
	return b
}

func TestParseTyping(t *testing.T) {
	cases := map[string]struct {
		payload    string
		wantTo     string
		wantChatID string
		wantOK     bool
	}{
		"valid":          {`{"type":"typing","to":"` + bob + `","chatId":"` + chat + `"}`, bob, chat, true},
		"other type":     {`{"type":"message","to":"` + bob + `","chatId":"` + chat + `"}`, "", "", false},
		"invalid user":   {`{"type":"typing","to":"not-an-id","chatId":"` + chat + `"}`, "", "", false},
		"uppercase id":   {`{"type":"typing","to":"64B7F0C2A1B2C3D4E5F60719","chatId":"` + chat + `"}`, "", "", false},
		"missing chat":   {`{"type":"typing","to":"` + bob + `"}`, "", "", false},
		"invalid chat":   {`{"type":"typing","to":"` + bob + `","chatId":"nope"}`, "", "", false},
		"missing target": {`{"type":"typing","chatId":"` + chat + `"}`, "", "", false},
		"not json":       {`typing`, "", "", false},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			to, chatID, ok := parseTyping([]byte(tc.payload))
			if to != tc.wantTo || chatID != tc.wantChatID || ok != tc.wantOK {
				t.Fatalf("got (%q, %q, %v), want (%q, %q, %v)", to, chatID, ok, tc.wantTo, tc.wantChatID, tc.wantOK)
			}
		})
	}
}

func TestRelayOnlyReachesFriends(t *testing.T) {
	b := testBroker(t)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	key := friendsKeyPrefix + alice
	b.client.SAdd(ctx, key, bob)
	t.Cleanup(func() { b.client.Del(context.Background(), key) })

	sub := b.client.Subscribe(ctx, ChannelPrefix+bob, ChannelPrefix+carol)
	defer sub.Close()
	if _, err := sub.Receive(ctx); err != nil {
		t.Fatalf("subscribe: %v", err)
	}
	messages := sub.Channel()

	conn := newFakeConn(alice)
	b.Inbound(conn, []byte(`{"type":"typing","to":"`+carol+`","chatId":"`+chat+`"}`))
	b.Inbound(conn, []byte(`{"type":"typing","to":"`+bob+`","chatId":"`+chat+`"}`))

	select {
	case msg := <-messages:
		want := `{"type":"typing","userId":"` + alice + `","chatId":"` + chat + `"}`
		if msg.Channel != ChannelPrefix+bob || msg.Payload != want {
			t.Fatalf("got %s %s, want typing from alice to bob only", msg.Channel, msg.Payload)
		}
	case <-ctx.Done():
		t.Fatal("no typing event received")
	}

	select {
	case msg := <-messages:
		t.Fatalf("unexpected extra event %s %s", msg.Channel, msg.Payload)
	case <-time.After(200 * time.Millisecond):
	}
}

func TestWatchKeepsOnlyRealIdsAndAlwaysTheUserOwn(t *testing.T) {
	b := testBroker(t)

	conn := newFakeConn(alice)
	b.Inbound(conn, []byte(`{"type":"presence:watch","ids":["`+bob+`","not-an-id","`+bob+`","`+alice+`"]}`))

	got := conn.watching()
	want := []string{alice, bob}
	if len(got) != len(want) {
		t.Fatalf("got %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("got %v, want %v", got, want)
		}
	}
}

func TestWatchIsAnsweredWithASingleSnapshotFrame(t *testing.T) {
	b := testBroker(t)

	conn := newFakeConn(alice)
	b.Inbound(conn, []byte(`{"type":"presence:watch","ids":["`+bob+`","`+carol+`"]}`))

	conn.mu.Lock()
	sent := len(conn.sent)
	conn.mu.Unlock()
	if sent != 1 {
		t.Fatalf("got %d frames, want a single snapshot", sent)
	}
}

func TestIdleFrameOnlyActsOnAChange(t *testing.T) {
	b := testBroker(t)
	t.Cleanup(func() { b.client.Del(context.Background(), connsKeyPrefix+alice) })

	conn := newFakeConn(alice)
	b.Inbound(conn, []byte(`{"type":"presence:idle","idle":true}`))
	if !conn.Idle() {
		t.Fatal("the connection should be idle")
	}

	if conn.SetIdle(true) {
		t.Fatal("setting the same flag reported a change")
	}
}

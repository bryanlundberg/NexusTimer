package broker

import (
	"context"
	"io"
	"log/slog"
	"os"
	"testing"
	"time"
)

const (
	alice = "64b7f0c2a1b2c3d4e5f60718"
	bob   = "64b7f0c2a1b2c3d4e5f60719"
	carol = "64b7f0c2a1b2c3d4e5f6071a"
)

func TestParseTyping(t *testing.T) {
	cases := map[string]struct {
		payload string
		wantTo  string
		wantOK  bool
	}{
		"valid":          {`{"type":"typing","to":"` + bob + `"}`, bob, true},
		"other type":     {`{"type":"message","to":"` + bob + `"}`, "", false},
		"invalid user":   {`{"type":"typing","to":"not-an-id"}`, "", false},
		"uppercase id":   {`{"type":"typing","to":"64B7F0C2A1B2C3D4E5F60719"}`, "", false},
		"missing target": {`{"type":"typing"}`, "", false},
		"not json":       {`typing`, "", false},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			to, ok := parseTyping([]byte(tc.payload))
			if to != tc.wantTo || ok != tc.wantOK {
				t.Fatalf("got (%q, %v), want (%q, %v)", to, ok, tc.wantTo, tc.wantOK)
			}
		})
	}
}

// Runs against a real Redis only when REDIS_TEST_URL is set.
func TestRelayOnlyReachesFriends(t *testing.T) {
	url := os.Getenv("REDIS_TEST_URL")
	if url == "" {
		t.Skip("REDIS_TEST_URL not set")
	}

	b, err := New(url, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = b.Close() })

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

	b.Relay(alice, []byte(`{"type":"typing","to":"`+carol+`"}`))
	b.Relay(alice, []byte(`{"type":"typing","to":"`+bob+`"}`))

	select {
	case msg := <-messages:
		want := `{"type":"typing","userId":"` + alice + `"}`
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

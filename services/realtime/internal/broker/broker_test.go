package broker

import (
	"context"
	"io"
	"log/slog"
	"os"
	"testing"
	"time"
)

type delivery struct {
	userID  string
	payload string
}

func TestRunDeliversPublishedEvents(t *testing.T) {
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
	if err := b.Ping(ctx); err != nil {
		t.Fatalf("ping: %v", err)
	}

	received := make(chan delivery, 1)
	done := make(chan struct{})
	go func() {
		b.Run(ctx, func(userID string, payload []byte) { received <- delivery{userID, string(payload)} }, func(string, []byte) {})
		close(done)
	}()

	want := delivery{"broker-test-user", `{"type":"friend:request","userId":"x"}`}
	ticker := time.NewTicker(50 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case got := <-received:
			if got != want {
				t.Fatalf("got %+v, want %+v", got, want)
			}
			cancel()
			<-done
			return
		case <-ticker.C:
			b.client.Publish(ctx, ChannelPrefix+want.userID, want.payload)
		case <-ctx.Done():
			t.Fatal("no event received")
		}
	}
}

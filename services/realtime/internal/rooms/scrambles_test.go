package rooms

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"slices"
	"testing"
)

func TestHTTPScramblesAsksTheAPIWithTheSharedSecret(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Event string `json:"event"`
			Count int    `json:"count"`
		}
		_ = json.NewDecoder(r.Body).Decode(&body)
		if r.Method != http.MethodPost || r.Header.Get("Authorization") != "Bearer secret" || body.Event != "SQ1" || body.Count != maxScramblesPerRequest {
			http.Error(w, "unexpected request", http.StatusBadRequest)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"scrambles": []string{"A", "B"}})
	}))
	defer srv.Close()

	got, err := HTTPScrambles{URL: srv.URL, Secret: []byte("secret")}.Scrambles(context.Background(), "SQ1", 50)

	if err != nil || !slices.Equal(got, []string{"A", "B"}) {
		t.Fatalf("got (%v, %v)", got, err)
	}
}

func TestHTTPScramblesFailures(t *testing.T) {
	failing := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "down", http.StatusServiceUnavailable)
	}))
	defer failing.Close()
	empty := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"scrambles":[]}`))
	}))
	defer empty.Close()

	if _, err := (HTTPScrambles{}).Scrambles(context.Background(), "3x3", 1); !errors.Is(err, ErrNoScrambleSource) {
		t.Errorf("unconfigured: got %v", err)
	}
	if _, err := (HTTPScrambles{URL: failing.URL}).Scrambles(context.Background(), "3x3", 1); err == nil {
		t.Error("a 503 was accepted")
	}
	if _, err := (HTTPScrambles{URL: empty.URL}).Scrambles(context.Background(), "3x3", 1); err == nil {
		t.Error("an empty reply was accepted")
	}
}

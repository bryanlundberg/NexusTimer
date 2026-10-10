package rooms

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

const maxScramblesPerRequest = 10

type ScrambleSource interface {
	Scrambles(ctx context.Context, event string, count int) ([]string, error)
}

var ErrNoScrambleSource = errors.New("SCRAMBLES_URL is not configured")

type HTTPScrambles struct {
	URL    string
	Secret []byte
	Client *http.Client
}

func (h HTTPScrambles) Scrambles(ctx context.Context, event string, count int) ([]string, error) {
	if h.URL == "" {
		return nil, ErrNoScrambleSource
	}
	body, err := json.Marshal(struct {
		Event string `json:"event"`
		Count int    `json:"count"`
	}{event, min(count, maxScramblesPerRequest)})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, h.URL, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+string(h.Secret))

	client := h.Client
	if client == nil {
		client = http.DefaultClient
	}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("scrambles: unexpected status %d", res.StatusCode)
	}

	var reply struct {
		Scrambles []string `json:"scrambles"`
	}
	if err := json.NewDecoder(res.Body).Decode(&reply); err != nil {
		return nil, err
	}
	if len(reply.Scrambles) == 0 {
		return nil, errors.New("scrambles: empty reply")
	}
	return reply.Scrambles, nil
}

package rooms

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Keys are mirrored by the API, which reads the lobby for visitors without a session.
const (
	roomKeyPrefix = "rt:room:"
	lobbyKey      = "rt:rooms"
	stateTTL      = time.Hour
)

type Store interface {
	Save(ctx context.Context, state State) error
	Delete(ctx context.Context, roomID string) error
	LoadAll(ctx context.Context) ([]State, error)
	SaveLobby(ctx context.Context, rooms []SummaryView) error
}

type RedisStore struct{ client *redis.Client }

func NewRedisStore(redisURL string) (*RedisStore, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("parse REDIS_URL: %w", err)
	}
	return &RedisStore{client: redis.NewClient(opts)}, nil
}

func (s *RedisStore) Close() error { return s.client.Close() }

func (s *RedisStore) Save(ctx context.Context, state State) error {
	raw, err := json.Marshal(state)
	if err != nil {
		return err
	}
	return s.client.Set(ctx, roomKeyPrefix+state.ID, raw, stateTTL).Err()
}

func (s *RedisStore) Delete(ctx context.Context, roomID string) error {
	return s.client.Del(ctx, roomKeyPrefix+roomID).Err()
}

func (s *RedisStore) LoadAll(ctx context.Context) ([]State, error) {
	var states []State
	iter := s.client.Scan(ctx, 0, roomKeyPrefix+"*", 100).Iterator()
	for iter.Next(ctx) {
		raw, err := s.client.Get(ctx, iter.Val()).Bytes()
		if err != nil {
			continue
		}
		var state State
		if json.Unmarshal(raw, &state) == nil && state.ID != "" {
			states = append(states, state)
		}
	}
	return states, iter.Err()
}

// SaveLobby rewrites the whole index; there are few rooms and only one gateway writes it.
func (s *RedisStore) SaveLobby(ctx context.Context, rooms []SummaryView) error {
	_, err := s.client.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
		pipe.Del(ctx, lobbyKey)
		if len(rooms) == 0 {
			return nil
		}
		fields := make(map[string]any, len(rooms))
		for _, room := range rooms {
			raw, err := json.Marshal(room)
			if err != nil {
				return err
			}
			fields[room.RoomID] = raw
		}
		pipe.HSet(ctx, lobbyKey, fields)
		pipe.Expire(ctx, lobbyKey, stateTTL)
		return nil
	})
	return err
}

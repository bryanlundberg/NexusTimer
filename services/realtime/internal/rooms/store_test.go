package rooms

import (
	"context"
	"encoding/json"
	"os"
	"testing"
	"time"
)

func redisStore(t *testing.T) *RedisStore {
	t.Helper()
	url := os.Getenv("REDIS_TEST_URL")
	if url == "" {
		t.Skip("REDIS_TEST_URL not set")
	}
	store, err := NewRedisStore(url)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = store.Close() })
	return store
}

func TestRedisStoreSavesLoadsAndDeletesRooms(t *testing.T) {
	store := redisStore(t)
	ctx := context.Background()
	room, _ := New(DefaultConfig(), "storetest", public, joinAs("ana"), []string{"S1", "S2"}, time.Now())
	t.Cleanup(func() { _ = store.Delete(context.Background(), "storetest") })

	if err := store.Save(ctx, room.State()); err != nil {
		t.Fatal(err)
	}
	if ttl := store.client.TTL(ctx, roomKeyPrefix+"storetest").Val(); ttl <= 0 || ttl > stateTTL {
		t.Fatalf("TTL = %v, want up to %v", ttl, stateTTL)
	}

	states, err := store.LoadAll(ctx)
	if err != nil {
		t.Fatal(err)
	}
	var found *State
	for i := range states {
		if states[i].ID == "storetest" {
			found = &states[i]
		}
	}
	if found == nil || found.LeaderID != "ana" || found.Round.Scramble != "S1" || len(found.Players) != 1 {
		t.Fatalf("loaded %+v", found)
	}

	if err := store.Delete(ctx, "storetest"); err != nil {
		t.Fatal(err)
	}
	if store.client.Exists(ctx, roomKeyPrefix+"storetest").Val() != 0 {
		t.Fatal("room still saved after Delete")
	}
}

func TestRedisStoreRewritesTheLobby(t *testing.T) {
	store := redisStore(t)
	ctx := context.Background()
	t.Cleanup(func() { store.client.Del(context.Background(), lobbyKey) })

	if err := store.SaveLobby(ctx, []SummaryView{{RoomID: "a", Name: "A"}, {RoomID: "b", Name: "B"}}); err != nil {
		t.Fatal(err)
	}
	if err := store.SaveLobby(ctx, []SummaryView{{RoomID: "b", Name: "B2"}}); err != nil {
		t.Fatal(err)
	}

	fields := store.client.HGetAll(ctx, lobbyKey).Val()
	var b SummaryView
	if len(fields) != 1 || json.Unmarshal([]byte(fields["b"]), &b) != nil || b.Name != "B2" {
		t.Fatalf("lobby = %v", fields)
	}
	if ttl := store.client.TTL(ctx, lobbyKey).Val(); ttl <= 0 {
		t.Fatalf("lobby TTL = %v", ttl)
	}

	if err := store.SaveLobby(ctx, nil); err != nil {
		t.Fatal(err)
	}
	if store.client.Exists(ctx, lobbyKey).Val() != 0 {
		t.Fatal("an empty lobby left its key behind")
	}
}

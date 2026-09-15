package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"time"

	"nexustimer/realtime/internal/hub"
)

type healthResponse struct {
	Redis bool `json:"redis"`
	hub.Stats
	Goroutines int    `json:"goroutines"`
	HeapMB     uint64 `json:"heapMb"`
	SysMB      uint64 `json:"sysMb"`
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), time.Second)
	defer cancel()

	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)

	res := healthResponse{
		Redis:      s.redis.Ping(ctx) == nil,
		Stats:      s.hub.Stats(),
		Goroutines: runtime.NumGoroutine(),
		HeapMB:     mem.HeapAlloc / 1024 / 1024,
		SysMB:      mem.Sys / 1024 / 1024,
	}

	w.Header().Set("Content-Type", "application/json")
	if !res.Redis {
		w.WriteHeader(http.StatusServiceUnavailable)
	}
	_ = json.NewEncoder(w).Encode(res)
}

// Probe backs the Docker HEALTHCHECK, since distroless images have no shell or wget.
func Probe(addr string) error {
	client := http.Client{Timeout: 3 * time.Second}
	res, err := client.Get("http://" + addr + "/health")
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("health returned %d", res.StatusCode)
	}
	return nil
}

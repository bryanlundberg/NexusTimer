package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"nexustimer/realtime/internal/broker"
	"nexustimer/realtime/internal/config"
	"nexustimer/realtime/internal/hub"
	"nexustimer/realtime/internal/rooms"
	"nexustimer/realtime/internal/server"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "healthcheck" {
		if err := server.Probe(config.HealthAddr()); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(logger); err != nil {
		logger.Error("gateway stopped", "error", err)
		os.Exit(1)
	}
}

func run(logger *slog.Logger) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	events, err := broker.New(cfg.RedisURL, logger)
	if err != nil {
		return err
	}
	defer events.Close()

	roomStore, err := rooms.NewRedisStore(cfg.RedisURL)
	if err != nil {
		return err
	}
	defer roomStore.Close()
	if cfg.ScramblesURL == "" {
		logger.Warn("SCRAMBLES_URL is not set, free play rooms will wait for scrambles")
	}
	scrambles := rooms.HTTPScrambles{URL: cfg.ScramblesURL, Secret: cfg.Secret, Client: &http.Client{Timeout: 10 * time.Second}}
	roomManager := rooms.NewManager(rooms.DefaultConfig(), roomStore, scrambles, logger)

	inbound := func(c hub.Conn, payload []byte) {
		if !roomManager.Inbound(c, payload) {
			events.Inbound(c, payload)
		}
	}
	connections := hub.New(hub.DefaultOptions(), logger, hub.Observe(events, roomManager), inbound)

	// The lease must exist before the first connection; KeepLease retries if Redis is down.
	claim, cancelClaim := context.WithTimeout(ctx, 5*time.Second)
	if err := events.ClaimLease(claim); err != nil {
		logger.Warn("claiming lease failed, presence is blind until Redis answers", "error", err)
	}
	cancelClaim()
	logger.Info("gateway identity", "instance", events.InstanceID())

	roomManager.Start(ctx)

	var wg sync.WaitGroup
	wg.Go(func() { events.Run(ctx, connections.Deliver, connections.Broadcast) })
	wg.Go(func() { events.KeepLease(ctx, connections.Connections) })

	err = server.New(cfg, connections, events, logger).Run(ctx)

	stop()
	wg.Wait()
	roomManager.Wait()
	return err
}

// Command realtime runs the WebSocket gateway.
//
// Usage:
//
//	realtime              run the gateway
//	realtime healthcheck  exit 0 if the running gateway is healthy
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"nexustimer/realtime/internal/broker"
	"nexustimer/realtime/internal/config"
	"nexustimer/realtime/internal/hub"
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

	connections := hub.New(hub.DefaultOptions(), logger, events, events.Inbound)

	// The lease has to exist before the first connection, since an entry only counts while the
	// gateway that wrote it does. A Redis that is down at boot is not fatal: KeepLease retries.
	claim, cancelClaim := context.WithTimeout(ctx, 5*time.Second)
	if err := events.ClaimLease(claim); err != nil {
		logger.Warn("claiming lease failed, presence is blind until Redis answers", "error", err)
	}
	cancelClaim()
	logger.Info("gateway identity", "instance", events.InstanceID())

	var wg sync.WaitGroup
	wg.Go(func() { events.Run(ctx, connections.Deliver, connections.Broadcast) })
	wg.Go(func() { events.KeepLease(ctx, connections.Connections) })

	err = server.New(cfg, connections, events, logger).Run(ctx)

	// A listener failure also has to stop the subscriber
	stop()
	wg.Wait()
	return err
}

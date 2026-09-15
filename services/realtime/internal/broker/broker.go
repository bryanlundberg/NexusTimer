// Package broker receives the events the Next.js app publishes to Redis.
package broker

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	"github.com/redis/go-redis/v9"
)

// ChannelPrefix matches userChannel in src/shared/lib/realtime/events.ts.
const ChannelPrefix = "rt:user:"

type DeliverFunc func(userID string, payload []byte)

type Broker struct {
	client *redis.Client
	logger *slog.Logger
}

func New(redisURL string, logger *slog.Logger) (*Broker, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("parse REDIS_URL: %w", err)
	}
	return &Broker{client: redis.NewClient(opts), logger: logger}, nil
}

// Run blocks until ctx is done. Every instance receives every event and only delivers
// to its own sockets; go-redis resubscribes on its own if Redis restarts.
func (b *Broker) Run(ctx context.Context, deliver DeliverFunc) {
	pubsub := b.client.PSubscribe(ctx, ChannelPrefix+"*")
	defer pubsub.Close()

	messages := pubsub.Channel()
	b.logger.Info("subscribed", "pattern", ChannelPrefix+"*")

	for {
		select {
		case <-ctx.Done():
			return
		case msg, ok := <-messages:
			if !ok {
				return
			}
			userID, found := strings.CutPrefix(msg.Channel, ChannelPrefix)
			if !found || userID == "" {
				continue
			}
			deliver(userID, []byte(msg.Payload))
		}
	}
}

func (b *Broker) Ping(ctx context.Context) error {
	return b.client.Ping(ctx).Err()
}

func (b *Broker) Close() error {
	return b.client.Close()
}

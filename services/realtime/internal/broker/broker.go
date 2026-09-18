package broker

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log/slog"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// ChannelPrefix matches userChannel in src/shared/lib/realtime/events.ts.
const ChannelPrefix = "rt:user:"

type DeliverFunc func(userID string, payload []byte)

type Broker struct {
	client     *redis.Client
	logger     *slog.Logger
	instanceID string
	done       chan struct{}
	once       sync.Once

	liveMu    sync.Mutex
	live      map[string]bool
	liveUntil time.Time
}

func New(redisURL string, logger *slog.Logger) (*Broker, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("parse REDIS_URL: %w", err)
	}
	return &Broker{
		client:     redis.NewClient(opts),
		logger:     logger,
		instanceID: newInstanceID(),
		done:       make(chan struct{}),
		live:       make(map[string]bool),
	}, nil
}

func newInstanceID() string {
	var buf [8]byte
	if _, err := rand.Read(buf[:]); err != nil {
		return strconv.FormatInt(time.Now().UnixNano(), 36)
	}
	return hex.EncodeToString(buf[:])
}

func (b *Broker) InstanceID() string { return b.instanceID }

func (b *Broker) Run(ctx context.Context, deliver, broadcast DeliverFunc) {
	patterns := []string{ChannelPrefix + "*", PresenceChannelPrefix + "*"}
	pubsub := b.client.PSubscribe(ctx, patterns...)
	defer pubsub.Close()

	messages := pubsub.Channel()
	b.logger.Info("subscribed", "patterns", patterns)

	for {
		select {
		case <-ctx.Done():
			return
		case msg, ok := <-messages:
			if !ok {
				return
			}
			if userID, found := strings.CutPrefix(msg.Channel, PresenceChannelPrefix); found && userID != "" {
				broadcast(userID, []byte(msg.Payload))
				continue
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
	b.once.Do(func() { close(b.done) })
	return b.client.Close()
}

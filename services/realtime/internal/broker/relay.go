package broker

import (
	"context"
	"encoding/json"
	"regexp"
	"time"

	"nexustimer/realtime/internal/hub"
)

const (
	// friendsKeyPrefix matches friends-cache.ts in the Next.js app; the gateway only reads it.
	friendsKeyPrefix = "friends:"
	relayTimeout     = time.Second
)

var objectIDPattern = regexp.MustCompile(`^[0-9a-f]{24}$`)

type clientFrame struct {
	Type   string   `json:"type"`
	To     string   `json:"to"`
	ChatID string   `json:"chatId"`
	IDs    []string `json:"ids"`
	Idle   bool     `json:"idle"`
}

type typingEvent struct {
	Type   string `json:"type"`
	UserID string `json:"userId"`
	ChatID string `json:"chatId"`
}

// Inbound ignores unknown types so the app can ship new frames before every gateway understands them.
func (b *Broker) Inbound(c hub.Conn, payload []byte) {
	var frame clientFrame
	if err := json.Unmarshal(payload, &frame); err != nil {
		return
	}

	switch frame.Type {
	case "typing":
		b.relayTyping(c.UserID(), payload)
	case "presence:watch":
		b.watch(c, frame.IDs)
	case "presence:idle":
		if c.SetIdle(frame.Idle) {
			b.SetIdle(c.UserID(), c.ConnID(), frame.Idle)
		}
	}
}

func parseTyping(payload []byte) (string, string, bool) {
	var frame clientFrame
	if err := json.Unmarshal(payload, &frame); err != nil {
		return "", "", false
	}
	if frame.Type != "typing" || !objectIDPattern.MatchString(frame.To) || !objectIDPattern.MatchString(frame.ChatID) {
		return "", "", false
	}
	return frame.To, frame.ChatID, true
}

func (b *Broker) relayTyping(userID string, payload []byte) {
	to, chatID, ok := parseTyping(payload)
	if !ok || to == userID {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), relayTimeout)
	defer cancel()

	isFriend, err := b.client.SIsMember(ctx, friendsKeyPrefix+userID, to).Result()
	if err != nil || !isFriend {
		return
	}

	event, _ := json.Marshal(typingEvent{Type: "typing", UserID: userID, ChatID: chatID})
	if err := b.client.Publish(ctx, ChannelPrefix+to, event).Err(); err != nil {
		b.logger.Warn("relay typing failed", "error", err)
	}
}

func (b *Broker) watch(c hub.Conn, ids []string) {
	seen := make(map[string]struct{}, len(ids)+1)
	wanted := make([]string, 0, len(ids)+1)

	seen[c.UserID()] = struct{}{}
	wanted = append(wanted, c.UserID())

	for _, id := range ids {
		if _, duplicate := seen[id]; duplicate || !objectIDPattern.MatchString(id) {
			continue
		}
		seen[id] = struct{}{}
		wanted = append(wanted, id)
	}

	accepted := c.Watch(wanted)

	ctx, cancel := context.WithTimeout(context.Background(), presenceTimeout)
	defer cancel()
	if snapshot := b.Snapshot(ctx, accepted); snapshot != nil {
		c.Send(snapshot)
	}
}

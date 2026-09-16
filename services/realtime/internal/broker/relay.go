package broker

import (
	"context"
	"encoding/json"
	"regexp"
	"time"
)

const (
	// friendsKeyPrefix matches friends-cache.ts in the Next.js app; the gateway only reads it.
	friendsKeyPrefix = "friends:"
	relayTimeout     = time.Second
)

var objectIDPattern = regexp.MustCompile(`^[0-9a-f]{24}$`)

type clientFrame struct {
	Type   string `json:"type"`
	To     string `json:"to"`
	ChatID string `json:"chatId"`
}

type typingEvent struct {
	Type   string `json:"type"`
	UserID string `json:"userId"`
	ChatID string `json:"chatId"`
}

// parseTyping returns the recipient and the chat the indicator belongs to. The gateway only
// knows user channels, so the browser addresses a person and names the chat in the payload.
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

// Relay forwards a typing indicator to a friend. An uncached friendship drops the indicator
// rather than querying Mongo, which is fine because opening a conversation primes the cache.
func (b *Broker) Relay(userID string, payload []byte) {
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

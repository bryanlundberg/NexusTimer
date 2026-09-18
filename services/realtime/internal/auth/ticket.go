// Ticket format mirrors src/shared/lib/realtime/ticket.ts; keep both in sync.
package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"
)

var (
	ErrMalformed = errors.New("malformed ticket")
	ErrSignature = errors.New("invalid ticket signature")
	ErrExpired   = errors.New("expired ticket")
)

type claims struct {
	Sub string `json:"sub"`
	Exp int64  `json:"exp"`
}

func VerifyTicket(ticket string, secret []byte, now time.Time) (string, error) {
	payload, signature, found := strings.Cut(ticket, ".")
	if !found || payload == "" || signature == "" {
		return "", ErrMalformed
	}

	given, err := base64.RawURLEncoding.DecodeString(signature)
	if err != nil {
		return "", ErrMalformed
	}
	if !hmac.Equal(given, sign(payload, secret)) {
		return "", ErrSignature
	}

	raw, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return "", ErrMalformed
	}
	var c claims
	if err := json.Unmarshal(raw, &c); err != nil || c.Sub == "" {
		return "", ErrMalformed
	}
	if c.Exp < now.UnixMilli() {
		return "", ErrExpired
	}
	return c.Sub, nil
}

func NewTicket(userID string, secret []byte, expiresAt time.Time) string {
	raw, _ := json.Marshal(claims{Sub: userID, Exp: expiresAt.UnixMilli()})
	payload := base64.RawURLEncoding.EncodeToString(raw)
	return payload + "." + base64.RawURLEncoding.EncodeToString(sign(payload, secret))
}

func sign(payload string, secret []byte) []byte {
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(payload))
	return mac.Sum(nil)
}

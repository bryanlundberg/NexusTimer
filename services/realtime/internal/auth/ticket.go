// Ticket format mirrors services/api/src/modules/realtime/realtime.service.ts; keep both in sync.
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

type Identity struct {
	UserID string
	Name   string
	Image  string
}

type claims struct {
	Sub   string `json:"sub"`
	Exp   int64  `json:"exp"`
	Name  string `json:"name,omitempty"`
	Image string `json:"image,omitempty"`
}

func VerifyTicket(ticket string, secret []byte, now time.Time) (Identity, error) {
	payload, signature, found := strings.Cut(ticket, ".")
	if !found || payload == "" || signature == "" {
		return Identity{}, ErrMalformed
	}

	given, err := base64.RawURLEncoding.DecodeString(signature)
	if err != nil {
		return Identity{}, ErrMalformed
	}
	if !hmac.Equal(given, sign(payload, secret)) {
		return Identity{}, ErrSignature
	}

	raw, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return Identity{}, ErrMalformed
	}
	var c claims
	if err := json.Unmarshal(raw, &c); err != nil || c.Sub == "" {
		return Identity{}, ErrMalformed
	}
	if c.Exp < now.UnixMilli() {
		return Identity{}, ErrExpired
	}
	return Identity{UserID: c.Sub, Name: c.Name, Image: c.Image}, nil
}

func NewTicket(id Identity, secret []byte, expiresAt time.Time) string {
	raw, _ := json.Marshal(claims{Sub: id.UserID, Exp: expiresAt.UnixMilli(), Name: id.Name, Image: id.Image})
	payload := base64.RawURLEncoding.EncodeToString(raw)
	return payload + "." + base64.RawURLEncoding.EncodeToString(sign(payload, secret))
}

func sign(payload string, secret []byte) []byte {
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(payload))
	return mac.Sum(nil)
}

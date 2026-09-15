package auth

import (
	"errors"
	"testing"
	"time"
)

const (
	testSecret = "test-secret"
	testUser   = "64b7f0c2a1b2c3d4e5f60718"
	// Produced by createTicket(testUser, testSecret, 1700000000000) in src/shared/lib/realtime/ticket.ts
	nextTicket = "eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDB9.M2cwXbr6JI22nKGLGKDUfbamHTE5kcoMafQKbQ8fzoo"
)

var issuedAt = time.UnixMilli(1700000000000)

func TestVerifyTicketAcceptsTicketsFromNext(t *testing.T) {
	userID, err := VerifyTicket(nextTicket, []byte(testSecret), issuedAt.Add(time.Second))
	if err != nil || userID != testUser {
		t.Fatalf("got (%q, %v), want (%q, nil)", userID, err, testUser)
	}
}

func TestNewTicketMatchesNextFormat(t *testing.T) {
	if got := NewTicket(testUser, []byte(testSecret), issuedAt.Add(time.Minute)); got != nextTicket {
		t.Fatalf("NewTicket = %q, want %q", got, nextTicket)
	}
}

func TestVerifyTicketRejects(t *testing.T) {
	forgedPayload := "eyJzdWIiOiJzb21lb25lLWVsc2UiLCJleHAiOjE3MDAwMDAwNjAwMDB9"
	realSignature := nextTicket[len(nextTicket)-43:]

	cases := map[string]struct {
		ticket string
		secret string
		now    time.Time
		want   error
	}{
		"expired":        {nextTicket, testSecret, issuedAt.Add(61 * time.Second), ErrExpired},
		"wrong secret":   {nextTicket, "other-secret", issuedAt, ErrSignature},
		"tampered":       {forgedPayload + "." + realSignature, testSecret, issuedAt, ErrSignature},
		"empty":          {"", testSecret, issuedAt, ErrMalformed},
		"no signature":   {"abc.", testSecret, issuedAt, ErrMalformed},
		"no separator":   {"abc", testSecret, issuedAt, ErrMalformed},
		"bad base64 sig": {"abc.!!!", testSecret, issuedAt, ErrMalformed},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			userID, err := VerifyTicket(tc.ticket, []byte(tc.secret), tc.now)
			if !errors.Is(err, tc.want) {
				t.Fatalf("got (%q, %v), want %v", userID, err, tc.want)
			}
		})
	}
}

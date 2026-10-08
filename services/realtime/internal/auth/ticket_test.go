package auth

import (
	"errors"
	"testing"
	"time"
)

const (
	testSecret = "test-secret"
	testUser   = "64b7f0c2a1b2c3d4e5f60718"
	// Produced by createTicket({ userId: testUser }, testSecret, 1700000000000) in services/api/src/modules/realtime/realtime.service.ts
	nextTicket = "eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDB9.M2cwXbr6JI22nKGLGKDUfbamHTE5kcoMafQKbQ8fzoo"
	// Produced by createTicket({ userId: testUser, name: 'Ada', image: 'https://cdn.example.test/ada.png' }, testSecret, 1700000000000)
	profileTicket = "eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDAsIm5hbWUiOiJBZGEiLCJpbWFnZSI6Imh0dHBzOi8vY2RuLmV4YW1wbGUudGVzdC9hZGEucG5nIn0.2gm8U_4Vsn8s8amvj5iPZE-Cv1fG4Zw6utfWaWOmcPY"
)

var testProfile = Identity{UserID: testUser, Name: "Ada", Image: "https://cdn.example.test/ada.png"}

var issuedAt = time.UnixMilli(1700000000000)

func TestVerifyTicketAcceptsTicketsFromNext(t *testing.T) {
	id, err := VerifyTicket(nextTicket, []byte(testSecret), issuedAt.Add(time.Second))
	if err != nil || id != (Identity{UserID: testUser}) {
		t.Fatalf("got (%+v, %v), want (%q, nil)", id, err, testUser)
	}
}

func TestVerifyTicketReadsTheProfile(t *testing.T) {
	id, err := VerifyTicket(profileTicket, []byte(testSecret), issuedAt.Add(time.Second))
	if err != nil || id != testProfile {
		t.Fatalf("got (%+v, %v), want (%+v, nil)", id, err, testProfile)
	}
}

func TestNewTicketMatchesNextFormat(t *testing.T) {
	if got := NewTicket(Identity{UserID: testUser}, []byte(testSecret), issuedAt.Add(time.Minute)); got != nextTicket {
		t.Fatalf("NewTicket = %q, want %q", got, nextTicket)
	}
	if got := NewTicket(testProfile, []byte(testSecret), issuedAt.Add(time.Minute)); got != profileTicket {
		t.Fatalf("NewTicket = %q, want %q", got, profileTicket)
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
			id, err := VerifyTicket(tc.ticket, []byte(tc.secret), tc.now)
			if !errors.Is(err, tc.want) {
				t.Fatalf("got (%+v, %v), want %v", id, err, tc.want)
			}
		})
	}
}

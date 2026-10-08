package rooms

import (
	"errors"
	"slices"
	"strings"
	"unicode/utf8"
)

// Mirrors FREE_PLAY_EVENTS, ROOM_ROUND_SECONDS and ROOM_NAME_MAX_LENGTH in packages/contracts/src/rooms.ts.
var (
	Events       = []string{"2x2", "3x3", "4x4", "5x5", "6x6", "7x7", "3x3 OH", "Clock", "Megaminx", "Pyraminx", "Skewb", "FTO", "SQ1"}
	RoundSeconds = []int{60, 120, 180, 300, 600}
)

const NameMaxLength = 40

var ErrInvalidSettings = errors.New("invalid room settings")

type Settings struct {
	Name         string `json:"name"`
	Event        string `json:"event"`
	MaxRoundTime int    `json:"maxRoundTime"`
	Code         string `json:"code,omitempty"`
}

func (s Settings) Private() bool { return s.Code != "" }

func NormalizeSettings(s Settings) (Settings, error) {
	s.Name = strings.TrimSpace(s.Name)
	if s.Name == "" || utf8.RuneCountInString(s.Name) > NameMaxLength {
		return Settings{}, ErrInvalidSettings
	}
	if !slices.Contains(Events, s.Event) || !slices.Contains(RoundSeconds, s.MaxRoundTime) {
		return Settings{}, ErrInvalidSettings
	}
	return s, nil
}

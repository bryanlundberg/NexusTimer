package rooms

import "time"

// Wire shapes mirror RoomEvent and its views in packages/contracts/src/rooms.ts.

type ErrorCode string

const (
	ErrNotFound        ErrorCode = "not-found"
	ErrWrongCode       ErrorCode = "wrong-code"
	ErrFull            ErrorCode = "full"
	ErrBanned          ErrorCode = "banned"
	ErrForbidden       ErrorCode = "forbidden"
	ErrTooManyAttempts ErrorCode = "too-many-attempts"
	ErrUpgradeRequired ErrorCode = "upgrade-required"
	ErrInvalid         ErrorCode = "invalid"
)

type PlayerView struct {
	UserID   string  `json:"userId"`
	Name     string  `json:"name"`
	Image    *string `json:"image"`
	JoinedAt int64   `json:"joinedAt"`
	Status   Status  `json:"status"`
	StatusAt int64   `json:"statusAt"`
	Online   bool    `json:"online"`
}

type RoundView struct {
	Index    int     `json:"index"`
	Scramble *string `json:"scramble"`
	StartsAt int64   `json:"startsAt"`
	Deadline int64   `json:"deadline"`
}

type SolveView struct {
	UserID      string   `json:"userId"`
	Round       int      `json:"round"`
	Time        int64    `json:"time"`
	Penalty     *Penalty `json:"penalty"`
	ConfirmBy   int64    `json:"confirmBy"`
	SubmittedAt int64    `json:"submittedAt"`
}

type SnapshotView struct {
	RoomID       string       `json:"roomId"`
	Name         string       `json:"name"`
	Event        string       `json:"event"`
	Private      bool         `json:"private"`
	Code         string       `json:"code,omitempty"`
	MaxRoundTime int          `json:"maxRoundTime"`
	MaxPlayers   int          `json:"maxPlayers"`
	CreatedBy    string       `json:"createdBy"`
	CreatedAt    int64        `json:"createdAt"`
	LeaderID     *string      `json:"leaderId"`
	Round        RoundView    `json:"round"`
	Players      []PlayerView `json:"players"`
	Solves       []SolveView  `json:"solves"`
	Version      int64        `json:"version"`
}

type SummaryPlayer struct {
	UserID string  `json:"userId"`
	Name   string  `json:"name"`
	Image  *string `json:"image"`
}

type SummaryView struct {
	RoomID        string          `json:"roomId"`
	Name          string          `json:"name"`
	Event         string          `json:"event"`
	Private       bool            `json:"private"`
	MaxRoundTime  int             `json:"maxRoundTime"`
	MaxPlayers    int             `json:"maxPlayers"`
	CreatedAt     int64           `json:"createdAt"`
	RoundDeadline int64           `json:"roundDeadline"`
	Players       []SummaryPlayer `json:"players"`
}

type CreatedEvent struct {
	Type   string `json:"type"`
	Rid    int64  `json:"rid,omitempty"`
	RoomID string `json:"roomId"`
}

type SnapshotEvent struct {
	Type      string       `json:"type"`
	Rid       int64        `json:"rid,omitempty"`
	Room      SnapshotView `json:"room"`
	ServerNow int64        `json:"serverNow"`
}

type RoundEvent struct {
	Type      string    `json:"type"`
	RoomID    string    `json:"roomId"`
	Round     RoundView `json:"round"`
	ServerNow int64     `json:"serverNow"`
	Version   int64     `json:"version"`
}

type SolveEvent struct {
	Type    string    `json:"type"`
	RoomID  string    `json:"roomId"`
	Solve   SolveView `json:"solve"`
	Version int64     `json:"version"`
}

type MembersEvent struct {
	Type     string       `json:"type"`
	RoomID   string       `json:"roomId"`
	Players  []PlayerView `json:"players"`
	LeaderID *string      `json:"leaderId"`
	Version  int64        `json:"version"`
}

type PlayerEvent struct {
	Type    string     `json:"type"`
	RoomID  string     `json:"roomId"`
	Player  PlayerView `json:"player"`
	Version int64      `json:"version"`
}

type KickedEvent struct {
	Type   string `json:"type"`
	RoomID string `json:"roomId"`
}

type ReplacedEvent struct {
	Type     string `json:"type"`
	RoomID   string `json:"roomId"`
	ToRoomID string `json:"toRoomId"`
}

type ClosedEvent struct {
	Type   string `json:"type"`
	RoomID string `json:"roomId"`
}

type LobbyEvent struct {
	Type  string        `json:"type"`
	Rid   int64         `json:"rid,omitempty"`
	Rooms []SummaryView `json:"rooms"`
}

type ErrorEvent struct {
	Type   string    `json:"type"`
	Rid    int64     `json:"rid,omitempty"`
	RoomID string    `json:"roomId,omitempty"`
	Code   ErrorCode `json:"code"`
}

func millis(t time.Time) int64 {
	if t.IsZero() {
		return 0
	}
	return t.UnixMilli()
}

func optional[T ~string](value T) *T {
	if value == "" {
		return nil
	}
	return &value
}

func (p *Player) view() PlayerView {
	return PlayerView{
		UserID:   p.UserID,
		Name:     p.Name,
		Image:    optional(p.Image),
		JoinedAt: millis(p.JoinedAt),
		Status:   p.Status,
		StatusAt: millis(p.StatusAt),
		Online:   p.Online(),
	}
}

func (r Round) view() RoundView {
	return RoundView{Index: r.Index, Scramble: optional(r.Scramble), StartsAt: millis(r.StartsAt), Deadline: millis(r.Deadline)}
}

func (s Solve) view() SolveView {
	return SolveView{
		UserID:      s.UserID,
		Round:       s.Round,
		Time:        s.Time,
		Penalty:     optional(s.Penalty),
		ConfirmBy:   millis(s.ConfirmBy),
		SubmittedAt: millis(s.SubmittedAt),
	}
}

package rooms

import "time"

type Status string

const (
	StatusIdle       Status = "idle"
	StatusInspecting Status = "inspecting"
	StatusSolving    Status = "solving"
	StatusDone       Status = "done"
)

type Penalty string

const (
	PenaltyOK    Penalty = "ok"
	PenaltyPlus2 Penalty = "plus2"
	PenaltyDNF   Penalty = "dnf"
)

type Player struct {
	UserID       string    `json:"userId"`
	Name         string    `json:"name"`
	Image        string    `json:"image,omitempty"`
	ConnID       string    `json:"-"`
	JoinedAt     time.Time `json:"joinedAt"`
	Status       Status    `json:"status"`
	StatusAt     time.Time `json:"statusAt"`
	OfflineSince time.Time `json:"offlineSince"`
}

func (p *Player) Online() bool { return p.ConnID != "" }

type Round struct {
	Index    int       `json:"index"`
	Scramble string    `json:"scramble,omitempty"`
	StartsAt time.Time `json:"startsAt"`
	Deadline time.Time `json:"deadline"`
	EndedAt  time.Time `json:"endedAt"`
}

func (r Round) Running() bool { return !r.Deadline.IsZero() }

type Solve struct {
	UserID      string    `json:"userId"`
	Round       int       `json:"round"`
	Time        int64     `json:"time"`
	Penalty     Penalty   `json:"penalty,omitempty"`
	ConfirmBy   time.Time `json:"confirmBy"`
	SubmittedAt time.Time `json:"submittedAt"`
}

type codeAttempts struct {
	Failures    int       `json:"failures"`
	LockedUntil time.Time `json:"lockedUntil"`
}

type State struct {
	ID               string                  `json:"id"`
	Settings         Settings                `json:"settings"`
	CreatedBy        string                  `json:"createdBy"`
	CreatedAt        time.Time               `json:"createdAt"`
	LeaderID         string                  `json:"leaderId"`
	Round            Round                   `json:"round"`
	Previous         Round                   `json:"previous"`
	NextRoundAt      time.Time               `json:"nextRoundAt"`
	Players          []*Player               `json:"players"`
	Solves           []Solve                 `json:"solves"`
	Scrambles        []string                `json:"scrambles"`
	ScramblesPending bool                    `json:"-"`
	Access           map[string]bool         `json:"access"`
	Banned           map[string]bool         `json:"banned"`
	Attempts         map[string]codeAttempts `json:"attempts"`
	EmptySince       time.Time               `json:"emptySince"`
	Closed           bool                    `json:"closed"`
	Version          int64                   `json:"version"`
}

func (s *State) player(userID string) *Player {
	for _, p := range s.Players {
		if p.UserID == userID {
			return p
		}
	}
	return nil
}

func (s *State) playerByConn(connID string) *Player {
	if connID == "" {
		return nil
	}
	for _, p := range s.Players {
		if p.ConnID == connID {
			return p
		}
	}
	return nil
}

func (s *State) solve(userID string, round int) *Solve {
	for i := range s.Solves {
		if s.Solves[i].UserID == userID && s.Solves[i].Round == round {
			return &s.Solves[i]
		}
	}
	return nil
}

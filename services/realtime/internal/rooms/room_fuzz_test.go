package rooms

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
	"time"
)

const fuzzUsers = 4

var fuzzSteps = []time.Duration{
	0, time.Millisecond, 50 * time.Millisecond, 500 * time.Millisecond, time.Second, 2500 * time.Millisecond,
	3 * time.Second, 5 * time.Second, 11 * time.Second, 21 * time.Second, 59 * time.Second, 61 * time.Second, 5 * time.Minute,
}

var fuzzCodes = []string{"", "ABCD", " abcd ", "WRONG"}

type fuzzInput struct {
	data []byte
	pos  int
}

func (f *fuzzInput) done() bool { return f.pos >= len(f.data) }

func (f *fuzzInput) byte() byte {
	if f.done() {
		return 0
	}
	b := f.data[f.pos]
	f.pos++
	return b
}

func (f *fuzzInput) pick(n int) int { return int(f.byte()) % n }

type roomHarness struct {
	t       *testing.T
	cfg     Config
	room    *Room
	now     time.Time
	version int64
	wanted  int
	stale   bool
	log     []string
}

func (h *roomHarness) fail(format string, args ...any) {
	h.t.Helper()
	h.t.Fatalf("%s\nsteps:\n  %s", fmt.Sprintf(format, args...), strings.Join(h.log, "\n  "))
}

func fuzzUser(i int) string { return fmt.Sprintf("u%d", i) }

func fuzzConn(user, gen int) string { return fmt.Sprintf("c%d.%d", user, gen) }

func (h *roomHarness) step(in Input) {
	h.t.Helper()
	h.log = append(h.log, fmt.Sprintf("%v %T%+v", h.now.Sub(t0), in, in))
	h.apply(h.room.Step(in, h.now))
}

func (h *roomHarness) apply(fx []Effect) {
	h.t.Helper()
	last := h.version
	for _, effect := range fx {
		switch e := effect.(type) {
		case Send:
			if e.ConnID == "" {
				h.fail("send without a connection: %+v", e)
			}
		case Broadcast:
			if v := eventVersion(e.Event); v <= last {
				h.fail("broadcast version %d after %d: %+v", v, last, e.Event)
			} else {
				last = v
			}
			for _, conn := range e.To {
				if conn == "" {
					h.fail("broadcast to an empty connection: %+v", e)
				}
			}
		case NeedScrambles:
			if e.Count <= 0 {
				h.fail("asked for %d scrambles", e.Count)
			}
			h.wanted = e.Count
		}
	}
	h.check()
}

func eventVersion(event any) int64 {
	switch e := event.(type) {
	case RoundEvent:
		return e.Version
	case SolveEvent:
		return e.Version
	case ChatEvent:
		return e.Version
	case MembersEvent:
		return e.Version
	case PlayerEvent:
		return e.Version
	}
	return 0
}

func (h *roomHarness) check() {
	h.t.Helper()
	s := h.room.State()

	if s.Version < h.version {
		h.fail("version went from %d to %d", h.version, s.Version)
	}
	h.version = s.Version

	if len(s.Players) > h.cfg.MaxPlayers {
		h.fail("%d players over the limit of %d", len(s.Players), h.cfg.MaxPlayers)
	}
	users := map[string]bool{}
	conns := map[string]bool{}
	for _, p := range s.Players {
		if users[p.UserID] {
			h.fail("%s is seated twice", p.UserID)
		}
		users[p.UserID] = true
		if p.ConnID != "" {
			if conns[p.ConnID] {
				h.fail("connection %s holds two seats", p.ConnID)
			}
			conns[p.ConnID] = true
		}
		if s.Banned[p.UserID] {
			h.fail("banned %s is seated", p.UserID)
		}
		if p.Online() != p.OfflineSince.IsZero() {
			h.fail("%s online=%v with offlineSince %v", p.UserID, p.Online(), p.OfflineSince)
		}
		if p.Status == StatusDone && s.solve(p.UserID, s.Round.Index) == nil {
			h.fail("%s is done without a solve in round %d", p.UserID, s.Round.Index)
		}
	}

	if len(s.Players) == 0 {
		if s.LeaderID != "" {
			h.fail("empty room led by %s", s.LeaderID)
		}
		if !s.NextRoundAt.IsZero() {
			h.fail("empty room has a next round at %v", s.NextRoundAt)
		}
		if !s.Closed && s.EmptySince.IsZero() {
			h.fail("empty room never closes")
		}
	} else {
		if s.player(s.LeaderID) == nil {
			h.fail("leader %q is not seated", s.LeaderID)
		}
		if !s.EmptySince.IsZero() {
			h.fail("occupied room is marked empty since %v", s.EmptySince)
		}
		if s.Closed {
			h.fail("closed room still has players")
		}
		if !s.Round.Running() && (len(s.Scrambles) > 0 || !s.ScramblesPending) {
			h.fail("players wait with no round, %d scrambles, pending=%v", len(s.Scrambles), s.ScramblesPending)
		}
	}

	if s.Round.Index < 1 {
		h.fail("round index %d", s.Round.Index)
	}
	if s.Round.Running() {
		if want := s.Round.StartsAt.Add(time.Duration(s.Settings.MaxRoundTime) * time.Second); !s.Round.Deadline.Equal(want) {
			h.fail("deadline %v, want %v", s.Round.Deadline, want)
		}
		if s.Round.Scramble == "" {
			h.fail("running round without a scramble")
		}
	}

	type key struct {
		user  string
		round int
	}
	seen := map[key]bool{}
	for _, solve := range s.Solves {
		k := key{solve.UserID, solve.Round}
		if seen[k] {
			h.fail("two solves for %s in round %d", solve.UserID, solve.Round)
		}
		seen[k] = true
		if solve.Round > s.Round.Index || solve.Round <= s.Round.Index-h.cfg.RecentRounds {
			h.fail("solve for round %d kept in round %d", solve.Round, s.Round.Index)
		}
		if solve.Time < 0 {
			h.fail("negative solve time %d", solve.Time)
		}
		switch solve.Penalty {
		case "":
			if solve.Round != s.Round.Index {
				h.fail("penalty still open for old round %d in round %d", solve.Round, s.Round.Index)
			}
		case PenaltyOK, PenaltyPlus2, PenaltyDNF:
		default:
			h.fail("unknown penalty %q", solve.Penalty)
		}
	}

	if len(s.Chat) > h.cfg.ChatHistory {
		h.fail("%d chat messages over the history of %d", len(s.Chat), h.cfg.ChatHistory)
	}
	for i := 1; i < len(s.Chat); i++ {
		if s.Chat[i].ID <= s.Chat[i-1].ID {
			h.fail("chat ids out of order: %d then %d", s.Chat[i-1].ID, s.Chat[i].ID)
		}
	}

	wake := h.room.NextWake()
	switch {
	case s.Closed && !wake.IsZero():
		h.fail("closed room wakes at %v", wake)
	case !s.Closed && len(s.Players) > 0 && s.Round.Running() && wake.IsZero():
		h.fail("running round never wakes")
	case !h.stale && !wake.IsZero() && !wake.After(h.now):
		h.fail("next wake %v is not after now %v", wake, h.now)
	}
}

func (h *roomHarness) restart() {
	h.t.Helper()
	raw, err := json.Marshal(h.room.State())
	if err != nil {
		h.fail("marshal: %v", err)
	}
	var state State
	if err := json.Unmarshal(raw, &state); err != nil {
		h.fail("unmarshal: %v", err)
	}
	h.log = append(h.log, fmt.Sprintf("%v restart", h.now.Sub(t0)))
	room, fx := Restore(h.cfg, state, h.now)
	h.room = room
	h.wanted = 0
	h.stale = true
	h.apply(fx)
	h.stale = false
}

func runRoomFuzz(t *testing.T, data []byte) {
	in := &fuzzInput{data: data}
	cfg := DefaultConfig()
	cfg.MaxPlayers = 3

	settings := public
	if in.pick(2) == 1 {
		settings.Code = "ABCD"
	}
	scrambles := in.pick(3)
	initial := make([]string, scrambles)
	for i := range initial {
		initial[i] = fmt.Sprintf("S%d", i)
	}

	h := &roomHarness{t: t, cfg: cfg, now: t0}
	creator := Join{ConnID: fuzzConn(0, 0), UserID: fuzzUser(0), Name: "u0", Rid: 1, Protocol: ProtocolVersion}
	room, fx := New(cfg, "room", settings, creator, initial, t0)
	h.room = room
	h.apply(fx)

	served := 0
	for steps := 0; !in.done() && steps < 400; steps++ {
		h.now = h.now.Add(fuzzSteps[in.pick(len(fuzzSteps))])
		user := in.pick(fuzzUsers)
		conn := fuzzConn(user, in.pick(3))
		rid := int64(steps + 2)
		s := h.room.State()

		switch in.pick(14) {
		case 0, 1:
			protocol := ProtocolVersion
			if in.pick(16) == 0 {
				protocol = 0
			}
			names := []string{"", fuzzUser(user), "renamed"}
			h.step(Join{ConnID: conn, UserID: fuzzUser(user), Name: names[in.pick(len(names))], Code: fuzzCodes[in.pick(len(fuzzCodes))], Rid: rid, Protocol: protocol})
		case 2:
			h.step(Leave{ConnID: conn})
		case 3:
			h.step(Disconnected{ConnID: conn})
		case 4:
			h.step(Moved{UserID: fuzzUser(user), ToRoomID: "other"})
		case 5:
			statuses := []Status{StatusIdle, StatusInspecting, StatusSolving, StatusDone, "bogus"}
			h.step(ReportStatus{ConnID: conn, Status: statuses[in.pick(len(statuses))]})
		case 6, 7:
			round := s.Round.Index - in.pick(3) + 1
			elapsed := h.now.Sub(s.Round.StartsAt).Milliseconds()
			times := []int64{elapsed, elapsed / 2, elapsed + 900, elapsed + 5000, 1, 0, -5}
			h.step(SubmitSolve{ConnID: conn, Rid: rid, Round: round, Time: times[in.pick(len(times))]})
		case 8:
			penalties := []Penalty{PenaltyOK, PenaltyPlus2, PenaltyDNF, ""}
			round := s.Round.Index - in.pick(2)
			h.step(SetPenalty{ConnID: conn, Rid: rid, Round: round, Penalty: penalties[in.pick(len(penalties))]})
		case 9:
			h.step(Kick{ConnID: conn, Rid: rid, UserID: fuzzUser(in.pick(fuzzUsers))})
		case 10:
			texts := []string{"hola", "  ", strings.Repeat("x", cfg.ChatMaxLength+1), "\xff", "gg  wp"}
			h.step(SendChat{ConnID: conn, Rid: rid, Text: texts[in.pick(len(texts))]})
		case 11:
			if !s.ScramblesPending {
				h.step(Tick{})
				break
			}
			if in.pick(4) == 0 {
				h.step(ScramblesFailed{})
				break
			}
			batch := []string{" "}
			for range h.wanted {
				served++
				batch = append(batch, fmt.Sprintf("F%d", served))
			}
			h.step(AddScrambles{Scrambles: batch})
		case 12:
			if wake := h.room.NextWake(); !wake.IsZero() && wake.After(h.now) {
				h.now = wake
			}
			h.step(Tick{})
		case 13:
			if h.room.Closed() {
				h.step(Tick{})
				break
			}
			h.restart()
		}
	}
}

func FuzzRoom(f *testing.F) {
	seeds := [][]byte{
		{},
		{0, 2, 0, 1, 0, 0, 0, 1, 0},
		{1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0},
		{0, 0, 4, 0, 0, 0, 1, 0, 0, 1, 0, 6, 0, 0, 3, 0, 6, 0, 0, 0, 0, 8, 0, 0, 0},
		{0, 1, 0, 1, 0, 0, 0, 1, 5, 0, 2, 0, 1, 0, 6, 0, 0, 9, 1, 0, 3, 0, 9, 0, 13, 0, 12},
		{1, 2, 0, 0, 0, 3, 0, 9, 0, 0, 12, 0, 0, 0, 11, 0, 0, 1, 0, 0, 11, 0, 12, 0, 0, 12},
	}
	for _, seed := range seeds {
		f.Add(seed)
	}
	f.Fuzz(runRoomFuzz)
}

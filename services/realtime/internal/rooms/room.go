package rooms

import (
	"crypto/subtle"
	"slices"
	"strings"
	"time"
)

type Input interface{ isInput() }

type Join struct {
	ConnID   string
	UserID   string
	Name     string
	Image    string
	Code     string
	Rid      int64
	Protocol int
}

type Leave struct{ ConnID string }

// Moved tells a room that the user took a seat in another room or connection elsewhere.
type Moved struct {
	UserID   string
	ToRoomID string
}

type Disconnected struct{ ConnID string }

type ReportStatus struct {
	ConnID string
	Status Status
}

type SubmitSolve struct {
	ConnID string
	Rid    int64
	Round  int
	Time   int64
}

type SetPenalty struct {
	ConnID  string
	Rid     int64
	Round   int
	Penalty Penalty
}

type Kick struct {
	ConnID string
	Rid    int64
	UserID string
}

type AddScrambles struct{ Scrambles []string }

type ScramblesFailed struct{}

type Tick struct{}

func (Join) isInput()            {}
func (Leave) isInput()           {}
func (Moved) isInput()           {}
func (Disconnected) isInput()    {}
func (ReportStatus) isInput()    {}
func (SubmitSolve) isInput()     {}
func (SetPenalty) isInput()      {}
func (Kick) isInput()            {}
func (AddScrambles) isInput()    {}
func (ScramblesFailed) isInput() {}
func (Tick) isInput()            {}

type Effect interface{ isEffect() }

type Send struct {
	ConnID string
	Event  any
}

// Broadcast lists its recipients when emitted: the players with an open connection at that moment.
type Broadcast struct {
	To    []string
	Event any
}

type SeatFreed struct{ UserID string }

type NeedScrambles struct{ Count int }

type LobbyChanged struct{}

type Closed struct{}

func (Send) isEffect()          {}
func (Broadcast) isEffect()     {}
func (SeatFreed) isEffect()     {}
func (NeedScrambles) isEffect() {}
func (LobbyChanged) isEffect()  {}
func (Closed) isEffect()        {}

type Room struct {
	cfg   Config
	state State
	fx    []Effect
}

// New seats the creator right away, so the creator is always the first player and the first leader.
func New(cfg Config, id string, settings Settings, creator Join, scrambles []string, now time.Time) (*Room, []Effect) {
	r := &Room{cfg: cfg, state: State{
		ID:        id,
		Settings:  settings,
		CreatedBy: creator.UserID,
		CreatedAt: now,
		Scrambles: slices.Clone(scrambles),
		Access:    map[string]bool{},
		Banned:    map[string]bool{},
		Attempts:  map[string]codeAttempts{},
	}}
	r.startRound(now, now)
	r.seat(creator, now)
	r.emit(Send{ConnID: creator.ConnID, Event: CreatedEvent{Type: "room:created", Rid: creator.Rid, RoomID: id}})
	return r, r.flush()
}

// Restore rebuilds a room from a snapshot. Connections do not survive a restart, so every player
// starts offline and gets the full disconnect grace to come back.
func Restore(cfg Config, state State, now time.Time) (*Room, []Effect) {
	r := &Room{cfg: cfg, state: state}
	s := &r.state
	if s.Access == nil {
		s.Access = map[string]bool{}
	}
	if s.Banned == nil {
		s.Banned = map[string]bool{}
	}
	if s.Attempts == nil {
		s.Attempts = map[string]codeAttempts{}
	}
	for _, p := range s.Players {
		p.ConnID = ""
		p.OfflineSince = now
	}
	s.ScramblesPending = false
	r.requestScrambles()
	return r, r.flush()
}

func (r *Room) ID() string     { return r.state.ID }
func (r *Room) State() State   { return r.state }
func (r *Room) Version() int64 { return r.state.Version }
func (r *Room) Closed() bool   { return r.state.Closed }

func (r *Room) Seated(userID, connID string) bool {
	p := r.state.player(userID)
	return p != nil && p.ConnID == connID
}

func (r *Room) Step(in Input, now time.Time) []Effect {
	r.advance(now)
	if r.state.Closed {
		if join, ok := in.(Join); ok {
			r.fail(join.ConnID, join.Rid, ErrNotFound)
		}
		return r.flush()
	}

	switch in := in.(type) {
	case Join:
		r.join(in, now)
	case Leave:
		if p := r.state.playerByConn(in.ConnID); p != nil {
			r.remove(p.UserID, now)
		}
	case Moved:
		r.moved(in, now)
	case Disconnected:
		r.disconnected(in, now)
	case ReportStatus:
		r.reportStatus(in, now)
	case SubmitSolve:
		r.submitSolve(in, now)
	case SetPenalty:
		r.setPenalty(in, now)
	case Kick:
		r.kick(in, now)
	case AddScrambles:
		r.addScrambles(in, now)
	case ScramblesFailed:
		r.state.ScramblesPending = false
		r.requestScrambles()
	case Tick:
	}
	return r.flush()
}

// NextWake is the earliest moment something changes on its own; the runtime calls Step with Tick then.
func (r *Room) NextWake() time.Time {
	s := &r.state
	if s.Closed {
		return time.Time{}
	}

	var next time.Time
	consider := func(t time.Time) {
		if !t.IsZero() && (next.IsZero() || t.Before(next)) {
			next = t
		}
	}
	for _, solve := range s.Solves {
		if solve.Penalty == "" {
			consider(solve.ConfirmBy)
		}
	}
	for _, p := range s.Players {
		if !p.Online() {
			consider(p.OfflineSince.Add(r.cfg.DisconnectGrace))
		}
	}
	switch {
	case len(s.Players) == 0:
		if !s.EmptySince.IsZero() {
			consider(s.EmptySince.Add(r.cfg.EmptyTTL))
		}
	case !s.NextRoundAt.IsZero():
		consider(s.NextRoundAt)
	case s.Round.Running():
		consider(s.Round.Deadline)
	}
	return next
}

func (r *Room) Snapshot(rid int64, now time.Time) SnapshotEvent {
	s := &r.state
	view := SnapshotView{
		RoomID:       s.ID,
		Name:         s.Settings.Name,
		Event:        s.Settings.Event,
		Private:      s.Settings.Private(),
		Code:         s.Settings.Code,
		MaxRoundTime: s.Settings.MaxRoundTime,
		MaxPlayers:   r.cfg.MaxPlayers,
		CreatedBy:    s.CreatedBy,
		CreatedAt:    millis(s.CreatedAt),
		LeaderID:     optional(s.LeaderID),
		Round:        s.Round.view(),
		Players:      r.playerViews(),
		Solves:       make([]SolveView, len(s.Solves)),
		Version:      s.Version,
	}
	for i, solve := range s.Solves {
		view.Solves[i] = solve.view()
	}
	return SnapshotEvent{Type: "room:snapshot", Rid: rid, Room: view, ServerNow: millis(now)}
}

func (r *Room) Summary() SummaryView {
	s := &r.state
	players := make([]SummaryPlayer, len(s.Players))
	for i, p := range s.Players {
		players[i] = SummaryPlayer{UserID: p.UserID, Name: p.Name, Image: optional(p.Image)}
	}
	return SummaryView{
		RoomID:        s.ID,
		Name:          s.Settings.Name,
		Event:         s.Settings.Event,
		Private:       s.Settings.Private(),
		MaxRoundTime:  s.Settings.MaxRoundTime,
		MaxPlayers:    r.cfg.MaxPlayers,
		CreatedAt:     millis(s.CreatedAt),
		RoundDeadline: millis(s.Round.Deadline),
		Players:       players,
	}
}

func (r *Room) advance(now time.Time) {
	for !r.state.Closed {
		at := r.NextWake()
		if at.IsZero() || at.After(now) {
			return
		}
		r.fire(at, now)
	}
}

// fire must consume everything NextWake reported at or before at, or advance would never return.
func (r *Room) fire(at, now time.Time) {
	s := &r.state
	for i := range s.Solves {
		if s.Solves[i].Penalty == "" && !s.Solves[i].ConfirmBy.After(at) {
			s.Solves[i].Penalty = PenaltyDNF
			r.broadcastSolve(s.Solves[i])
		}
	}
	for _, p := range slices.Clone(s.Players) {
		if !p.Online() && !p.OfflineSince.Add(r.cfg.DisconnectGrace).After(at) {
			r.remove(p.UserID, at)
		}
	}

	switch {
	case len(s.Players) == 0:
		if !s.EmptySince.IsZero() && !s.EmptySince.Add(r.cfg.EmptyTTL).After(at) {
			s.Closed = true
			r.emit(Closed{})
			r.emit(LobbyChanged{})
		}
	case !s.NextRoundAt.IsZero() && !s.NextRoundAt.After(at):
		r.startRound(r.catchUp(s.NextRoundAt, now), now)
	case s.Round.Running() && !s.Round.Deadline.After(at):
		r.startRound(r.catchUp(s.Round.Deadline, now), now)
	}
}

// catchUp starts a round now instead of replaying every round missed while nothing woke the room.
func (r *Room) catchUp(start, now time.Time) time.Time {
	if start.Add(r.roundLength()).After(now) {
		return start
	}
	return now
}

func (r *Room) roundLength() time.Duration {
	return time.Duration(r.state.Settings.MaxRoundTime) * time.Second
}

func (r *Room) startRound(start, now time.Time) {
	s := &r.state
	if s.Round.Index > 0 {
		s.Previous = s.Round
		s.Previous.EndedAt = start
		if s.Round.Running() && s.Round.Deadline.Before(start) {
			s.Previous.EndedAt = s.Round.Deadline
		}
	}
	s.NextRoundAt = time.Time{}
	r.closeRound(start)
	s.Round = Round{Index: s.Round.Index + 1, StartsAt: start}
	r.fillRound(start)

	for _, p := range s.Players {
		if p.Status != StatusIdle {
			p.Status = StatusIdle
			p.StatusAt = start
		}
	}
	keepFrom := s.Round.Index - r.cfg.RecentRounds
	s.Solves = slices.DeleteFunc(s.Solves, func(solve Solve) bool { return solve.Round <= keepFrom })

	r.broadcastRound(now)
	r.broadcastMembers()
	r.emit(LobbyChanged{})
	r.requestScrambles()
}

// closeRound turns what is still open in the ending round into DNFs: penalties nobody chose,
// and inspections or solves still running, like a time limit in competition.
func (r *Room) closeRound(end time.Time) {
	s := &r.state
	if !s.Round.Running() {
		return
	}
	for i := range s.Solves {
		if s.Solves[i].Round == s.Round.Index && s.Solves[i].Penalty == "" {
			s.Solves[i].Penalty = PenaltyDNF
			r.broadcastSolve(s.Solves[i])
		}
	}
	for _, p := range s.Players {
		r.abandon(p, end)
	}
}

// abandon records a DNF for an inspection or solve the player never finished in the current round.
func (r *Room) abandon(p *Player, at time.Time) {
	s := &r.state
	if !s.Round.Running() || (p.Status != StatusInspecting && p.Status != StatusSolving) || s.solve(p.UserID, s.Round.Index) != nil {
		return
	}
	s.Solves = append(s.Solves, Solve{UserID: p.UserID, Round: s.Round.Index, Penalty: PenaltyDNF, ConfirmBy: at, SubmittedAt: at})
	r.broadcastSolve(s.Solves[len(s.Solves)-1])
}

func (r *Room) fillRound(start time.Time) bool {
	s := &r.state
	if len(s.Scrambles) == 0 {
		return false
	}
	s.Round.Scramble = s.Scrambles[0]
	s.Scrambles = s.Scrambles[1:]
	s.Round.StartsAt = start
	s.Round.Deadline = start.Add(r.roundLength())
	return true
}

// resume gets a room going again when someone enters it empty or scrambles arrive late.
func (r *Room) resume(now time.Time) {
	s := &r.state
	if s.Round.Running() {
		if !s.Round.Deadline.After(now) {
			r.startRound(now, now)
		}
		return
	}
	if r.fillRound(now) {
		r.broadcastRound(now)
		r.emit(LobbyChanged{})
	}
	r.requestScrambles()
}

func (r *Room) requestScrambles() {
	s := &r.state
	if s.ScramblesPending {
		return
	}
	missing := r.cfg.ScrambleBuffer - len(s.Scrambles)
	if !s.Round.Running() {
		missing++
	}
	if missing > 0 {
		s.ScramblesPending = true
		r.emit(NeedScrambles{Count: missing})
	}
}

func (r *Room) addScrambles(in AddScrambles, now time.Time) {
	s := &r.state
	s.ScramblesPending = false
	for _, scramble := range in.Scrambles {
		if scramble = strings.TrimSpace(scramble); scramble != "" {
			s.Scrambles = append(s.Scrambles, scramble)
		}
	}
	if len(s.Players) > 0 {
		r.resume(now)
		return
	}
	r.requestScrambles()
}

func (r *Room) join(in Join, now time.Time) {
	s := &r.state
	if in.Protocol != ProtocolVersion {
		r.fail(in.ConnID, in.Rid, ErrUpgradeRequired)
		return
	}
	if p := s.player(in.UserID); p != nil {
		r.rejoin(p, in, now)
		return
	}
	if s.Banned[in.UserID] {
		r.fail(in.ConnID, in.Rid, ErrBanned)
		return
	}
	if !r.admit(in, now) {
		return
	}
	if len(s.Players) >= r.cfg.MaxPlayers {
		r.fail(in.ConnID, in.Rid, ErrFull)
		return
	}

	if len(s.Players) == 0 {
		r.resume(now)
	}
	r.seat(in, now)
	r.send(in.ConnID, r.Snapshot(in.Rid, now))
	r.broadcastMembers()
	r.emit(LobbyChanged{})
}

func (r *Room) admit(in Join, now time.Time) bool {
	s := &r.state
	if !s.Settings.Private() || in.UserID == s.CreatedBy || s.Access[in.UserID] {
		return true
	}

	attempts := s.Attempts[in.UserID]
	if now.Before(attempts.LockedUntil) {
		r.fail(in.ConnID, in.Rid, ErrTooManyAttempts)
		return false
	}
	if strings.TrimSpace(in.Code) == "" {
		r.fail(in.ConnID, in.Rid, ErrWrongCode)
		return false
	}
	if !codeMatches(s.Settings.Code, in.Code) {
		attempts.Failures++
		if attempts.Failures >= r.cfg.CodeAttempts {
			attempts = codeAttempts{LockedUntil: now.Add(r.cfg.CodeLockout)}
		}
		s.Attempts[in.UserID] = attempts
		r.fail(in.ConnID, in.Rid, ErrWrongCode)
		return false
	}

	delete(s.Attempts, in.UserID)
	s.Access[in.UserID] = true
	return true
}

func codeMatches(code, given string) bool {
	given = strings.ToUpper(strings.TrimSpace(given))
	return subtle.ConstantTimeCompare([]byte(code), []byte(given)) == 1
}

func (r *Room) seat(in Join, now time.Time) {
	s := &r.state
	s.Players = append(s.Players, &Player{
		UserID:   in.UserID,
		Name:     in.Name,
		Image:    in.Image,
		ConnID:   in.ConnID,
		JoinedAt: now,
		Status:   StatusIdle,
		StatusAt: now,
	})
	s.EmptySince = time.Time{}
	r.ensureLeader()
}

// rejoin keeps seniority, leadership, solves and an inspection or solve in progress, so a reload
// resumes it instead of getting another attempt; a different connection replaces the old one.
func (r *Room) rejoin(p *Player, in Join, now time.Time) {
	s := &r.state
	if p.ConnID != "" && p.ConnID != in.ConnID {
		r.send(p.ConnID, ReplacedEvent{Type: "room:replaced", RoomID: s.ID, ToRoomID: s.ID})
	}

	changed := p.ConnID != in.ConnID
	p.ConnID = in.ConnID
	p.OfflineSince = time.Time{}
	if in.Name != "" && (in.Name != p.Name || in.Image != p.Image) {
		p.Name, p.Image = in.Name, in.Image
		changed = true
	}
	r.send(in.ConnID, r.Snapshot(in.Rid, now))
	if changed {
		r.broadcastPlayer(p)
		r.emit(LobbyChanged{})
	}
}

func (r *Room) moved(in Moved, now time.Time) {
	s := &r.state
	p := s.player(in.UserID)
	if p == nil {
		return
	}
	if p.Online() {
		r.send(p.ConnID, ReplacedEvent{Type: "room:replaced", RoomID: s.ID, ToRoomID: in.ToRoomID})
	}
	r.remove(p.UserID, now)
}

func (r *Room) disconnected(in Disconnected, now time.Time) {
	p := r.state.playerByConn(in.ConnID)
	if p == nil {
		return
	}
	p.ConnID = ""
	p.OfflineSince = now
	r.broadcastPlayer(p)
	r.checkAllSolved(now)
}

func (r *Room) remove(userID string, at time.Time) {
	s := &r.state
	i := slices.IndexFunc(s.Players, func(p *Player) bool { return p.UserID == userID })
	if i < 0 {
		return
	}
	r.abandon(s.Players[i], at)
	s.Players = slices.Delete(s.Players, i, i+1)
	r.ensureLeader()
	if len(s.Players) == 0 {
		s.EmptySince = at
		s.NextRoundAt = time.Time{}
	}

	r.broadcastMembers()
	r.emit(SeatFreed{UserID: userID})
	r.emit(LobbyChanged{})
	r.checkAllSolved(at)
}

// ensureLeader keeps the current leader while they are in the room; otherwise the longest
// present player takes over, preferring players with an open connection.
func (r *Room) ensureLeader() {
	s := &r.state
	if s.LeaderID != "" && s.player(s.LeaderID) != nil {
		return
	}
	s.LeaderID = ""
	for _, p := range s.Players {
		if p.Online() {
			s.LeaderID = p.UserID
			return
		}
	}
	if len(s.Players) > 0 {
		s.LeaderID = s.Players[0].UserID
	}
}

func (r *Room) reportStatus(in ReportStatus, now time.Time) {
	p := r.state.playerByConn(in.ConnID)
	if p == nil || !r.state.Round.Running() || p.Status == StatusDone || p.Status == in.Status {
		return
	}
	switch in.Status {
	case StatusIdle, StatusInspecting, StatusSolving:
	default:
		return
	}
	p.Status = in.Status
	p.StatusAt = now
	r.broadcastPlayer(p)
}

func (r *Room) submitSolve(in SubmitSolve, now time.Time) {
	s := &r.state
	p := s.playerByConn(in.ConnID)
	if p == nil {
		r.fail(in.ConnID, in.Rid, ErrForbidden)
		return
	}
	round, open := r.openRound(in.Round, now)
	if !open || in.Time <= 0 || s.solve(p.UserID, in.Round) != nil {
		r.fail(in.ConnID, in.Rid, ErrInvalid)
		return
	}
	since := round.StartsAt
	if p.JoinedAt.After(since) {
		since = p.JoinedAt
	}
	if time.Duration(in.Time)*time.Millisecond > now.Sub(since)+r.cfg.SolveTolerance {
		r.fail(in.ConnID, in.Rid, ErrInvalid)
		return
	}

	solve := Solve{UserID: p.UserID, Round: in.Round, Time: in.Time, SubmittedAt: now}
	if in.Round == s.Round.Index {
		solve.ConfirmBy = s.Round.Deadline
	} else {
		solve.ConfirmBy = round.EndedAt
		solve.Penalty = PenaltyDNF
	}
	s.Solves = append(s.Solves, solve)
	r.broadcastSolve(s.Solves[len(s.Solves)-1])
	if in.Round == s.Round.Index {
		p.Status = StatusDone
		p.StatusAt = now
		r.broadcastPlayer(p)
	}
	r.checkAllSolved(now)
}

// openRound accepts the current round once it started, and the previous one for a moment after
// it ended so a solve stopped right at the deadline is recorded, as a DNF: its penalty can only
// be chosen while the round is open.
func (r *Room) openRound(index int, now time.Time) (Round, bool) {
	s := &r.state
	if index == s.Round.Index && s.Round.Running() && !now.Before(s.Round.StartsAt) {
		return s.Round, true
	}
	if index > 0 && index == s.Previous.Index && !now.After(s.Previous.EndedAt.Add(r.cfg.LateSubmit)) {
		return s.Previous, true
	}
	return Round{}, false
}

func (r *Room) setPenalty(in SetPenalty, now time.Time) {
	s := &r.state
	p := s.playerByConn(in.ConnID)
	if p == nil {
		r.fail(in.ConnID, in.Rid, ErrForbidden)
		return
	}
	switch in.Penalty {
	case PenaltyOK, PenaltyPlus2, PenaltyDNF:
	default:
		r.fail(in.ConnID, in.Rid, ErrInvalid)
		return
	}
	solve := s.solve(p.UserID, in.Round)
	if solve == nil || solve.Penalty != "" || now.After(solve.ConfirmBy) {
		r.fail(in.ConnID, in.Rid, ErrInvalid)
		return
	}
	solve.Penalty = in.Penalty
	r.broadcastSolve(*solve)
	r.checkAllSolved(now)
}

func (r *Room) kick(in Kick, now time.Time) {
	s := &r.state
	sender := s.playerByConn(in.ConnID)
	if sender == nil || sender.UserID != s.LeaderID {
		r.fail(in.ConnID, in.Rid, ErrForbidden)
		return
	}
	target := s.player(in.UserID)
	if target == nil || target == sender {
		r.fail(in.ConnID, in.Rid, ErrInvalid)
		return
	}
	if target.Online() {
		r.send(target.ConnID, KickedEvent{Type: "room:kicked", RoomID: s.ID})
	}
	s.Banned[target.UserID] = true
	delete(s.Access, target.UserID)
	r.remove(target.UserID, now)
}

// checkAllSolved ends the round early once every player, including those inside their disconnect
// grace, has a solve with its penalty chosen; a reload mid-solve must not end the round for them.
func (r *Room) checkAllSolved(now time.Time) {
	s := &r.state
	if !s.NextRoundAt.IsZero() || !s.Round.Running() || now.Before(s.Round.StartsAt) || len(s.Players) == 0 {
		return
	}
	for _, p := range s.Players {
		if solve := s.solve(p.UserID, s.Round.Index); solve == nil || solve.Penalty == "" {
			return
		}
	}
	s.NextRoundAt = now.Add(r.cfg.RoundBreak)
}

func (r *Room) playerViews() []PlayerView {
	views := make([]PlayerView, len(r.state.Players))
	for i, p := range r.state.Players {
		views[i] = p.view()
	}
	return views
}

func (r *Room) broadcastRound(now time.Time) {
	s := &r.state
	s.Version++
	r.emit(Broadcast{To: r.onlineConns(), Event: RoundEvent{Type: "room:round", RoomID: s.ID, Round: s.Round.view(), ServerNow: millis(now), Version: s.Version}})
}

func (r *Room) broadcastSolve(solve Solve) {
	s := &r.state
	s.Version++
	r.emit(Broadcast{To: r.onlineConns(), Event: SolveEvent{Type: "room:solve", RoomID: s.ID, Solve: solve.view(), Version: s.Version}})
}

func (r *Room) broadcastMembers() {
	s := &r.state
	s.Version++
	r.emit(Broadcast{To: r.onlineConns(), Event: MembersEvent{Type: "room:members", RoomID: s.ID, Players: r.playerViews(), LeaderID: optional(s.LeaderID), Version: s.Version}})
}

func (r *Room) broadcastPlayer(p *Player) {
	s := &r.state
	s.Version++
	r.emit(Broadcast{To: r.onlineConns(), Event: PlayerEvent{Type: "room:player", RoomID: s.ID, Player: p.view(), Version: s.Version}})
}

func (r *Room) onlineConns() []string {
	var conns []string
	for _, p := range r.state.Players {
		if p.Online() {
			conns = append(conns, p.ConnID)
		}
	}
	return conns
}

func (r *Room) send(connID string, event any) {
	if connID != "" {
		r.emit(Send{ConnID: connID, Event: event})
	}
}

func (r *Room) fail(connID string, rid int64, code ErrorCode) {
	r.send(connID, ErrorEvent{Type: "room:error", Rid: rid, RoomID: r.state.ID, Code: code})
}

func (r *Room) emit(effect Effect) { r.fx = append(r.fx, effect) }

func (r *Room) flush() []Effect {
	fx := r.fx
	r.fx = nil
	return fx
}

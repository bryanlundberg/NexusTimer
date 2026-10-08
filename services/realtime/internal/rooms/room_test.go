package rooms

import (
	"encoding/json"
	"slices"
	"testing"
	"time"
)

var t0 = time.UnixMilli(1_700_000_000_000)

var public = Settings{Name: "Sala", Event: "3x3", MaxRoundTime: 60}

func at(d time.Duration) time.Time { return t0.Add(d) }

func joinAs(userID string) Join {
	return Join{ConnID: "conn-" + userID, UserID: userID, Name: userID, Rid: 7, Protocol: ProtocolVersion}
}

func newRoom(t *testing.T, settings Settings) *Room {
	t.Helper()
	return newRoomWith(t, DefaultConfig(), settings)
}

func newRoomWith(t *testing.T, cfg Config, settings Settings) *Room {
	t.Helper()
	r, _ := New(cfg, "room", settings, joinAs("ana"), []string{"S1", "S2", "S3", "S4", "S5", "S6"}, t0)
	return r
}

func received[E any](fx []Effect, connID string) []E {
	var events []E
	for _, effect := range fx {
		var event any
		switch e := effect.(type) {
		case Send:
			if e.ConnID == connID {
				event = e.Event
			}
		case Broadcast:
			if slices.Contains(e.To, connID) {
				event = e.Event
			}
		}
		if typed, ok := event.(E); ok {
			events = append(events, typed)
		}
	}
	return events
}

func effectsOf[T Effect](fx []Effect) []T {
	var found []T
	for _, effect := range fx {
		if typed, ok := effect.(T); ok {
			found = append(found, typed)
		}
	}
	return found
}

func errorCodes(fx []Effect, connID string) []ErrorCode {
	var codes []ErrorCode
	for _, event := range received[ErrorEvent](fx, connID) {
		codes = append(codes, event.Code)
	}
	return codes
}

func only[E any](t *testing.T, events []E) E {
	t.Helper()
	if len(events) != 1 {
		t.Fatalf("got %d events, want 1: %+v", len(events), events)
	}
	return events[0]
}

func expectError(t *testing.T, fx []Effect, connID string, want ErrorCode) {
	t.Helper()
	if got := errorCodes(fx, connID); !slices.Equal(got, []ErrorCode{want}) {
		t.Fatalf("errors to %s = %v, want [%s]", connID, got, want)
	}
}

func expectNoError(t *testing.T, fx []Effect, connID string) {
	t.Helper()
	if got := errorCodes(fx, connID); len(got) > 0 {
		t.Fatalf("errors to %s = %v, want none", connID, got)
	}
}

func submit(r *Room, userID string, round int, ms int64, now time.Time) []Effect {
	return r.Step(SubmitSolve{ConnID: "conn-" + userID, Rid: 9, Round: round, Time: ms}, now)
}

func playerIDs(players []PlayerView) []string {
	ids := make([]string, len(players))
	for i, p := range players {
		ids[i] = p.UserID
	}
	return ids
}

func TestNewSeatsTheCreatorAsLeaderAndStartsTheFirstRound(t *testing.T) {
	r, fx := New(DefaultConfig(), "room", public, joinAs("ana"), []string{"S1", "S2", "S3", "S4", "S5"}, t0)

	created := only(t, received[CreatedEvent](fx, "conn-ana"))
	if created.Rid != 7 || created.RoomID != "room" {
		t.Fatalf("created = %+v", created)
	}
	if r.state.LeaderID != "ana" {
		t.Fatalf("leader = %q, want ana", r.state.LeaderID)
	}
	if round := r.state.Round; round.Index != 1 || round.Scramble != "S1" || !round.Deadline.Equal(at(time.Minute)) {
		t.Fatalf("round = %+v", round)
	}
	if len(effectsOf[NeedScrambles](fx)) != 0 {
		t.Fatal("asked for scrambles with a full buffer")
	}
}

func TestARoomWithoutScramblesWaitsForThem(t *testing.T) {
	r, fx := New(DefaultConfig(), "room", public, joinAs("ana"), nil, t0)

	if need := only(t, effectsOf[NeedScrambles](fx)); need.Count != 4 {
		t.Fatalf("asked for %d scrambles, want 4", need.Count)
	}
	if r.state.Round.Running() {
		t.Fatal("round running without a scramble")
	}
	if wake := r.NextWake(); !wake.IsZero() {
		t.Fatalf("NextWake = %v, want none while waiting", wake)
	}

	fx = r.Step(AddScrambles{Scrambles: []string{"S1", " ", "S2", "S3", "S4"}}, at(2*time.Second))

	round := only(t, received[RoundEvent](fx, "conn-ana")).Round
	if round.Index != 1 || *round.Scramble != "S1" || round.Deadline != at(62*time.Second).UnixMilli() {
		t.Fatalf("round = %+v", round)
	}
	if len(effectsOf[NeedScrambles](fx)) != 0 {
		t.Fatal("asked again with three scrambles queued")
	}
}

func TestFailedScrambleRequestsAreAskedAgain(t *testing.T) {
	r, _ := New(DefaultConfig(), "room", public, joinAs("ana"), nil, t0)

	if fx := r.Step(Tick{}, at(time.Second)); len(effectsOf[NeedScrambles](fx)) != 0 {
		t.Fatal("asked twice while a request is pending")
	}
	if fx := r.Step(ScramblesFailed{}, at(5*time.Second)); len(effectsOf[NeedScrambles](fx)) != 1 {
		t.Fatal("did not ask again after a failure")
	}
}

func TestJoinSendsTheSnapshotAndAnnouncesTheMembers(t *testing.T) {
	r := newRoom(t, public)

	fx := r.Step(joinAs("ben"), at(time.Second))

	snapshot := only(t, received[SnapshotEvent](fx, "conn-ben"))
	if snapshot.Rid != 7 || *snapshot.Room.LeaderID != "ana" || snapshot.ServerNow != at(time.Second).UnixMilli() {
		t.Fatalf("snapshot = %+v", snapshot)
	}
	if got := playerIDs(snapshot.Room.Players); !slices.Equal(got, []string{"ana", "ben"}) {
		t.Fatalf("players = %v", got)
	}
	members := only(t, received[MembersEvent](fx, "conn-ana"))
	if members.Version != snapshot.Room.Version+1 || len(members.Players) != 2 {
		t.Fatalf("members = %+v, snapshot version %d", members, snapshot.Room.Version)
	}
	if len(effectsOf[LobbyChanged](fx)) == 0 {
		t.Fatal("lobby not told about the new player")
	}
}

func TestJoinRejectsAnOldClient(t *testing.T) {
	r := newRoom(t, public)
	join := joinAs("ben")
	join.Protocol = ProtocolVersion + 1

	expectError(t, r.Step(join, at(time.Second)), "conn-ben", ErrUpgradeRequired)
}

func TestPrivateRoomsAskForTheCodeOnce(t *testing.T) {
	r := newRoom(t, Settings{Name: "Sala", Event: "3x3", MaxRoundTime: 60, Code: "ABC234"})

	expectError(t, r.Step(joinAs("ben"), at(time.Second)), "conn-ben", ErrWrongCode)

	join := joinAs("ben")
	join.Code = " abc234 "
	expectNoError(t, r.Step(join, at(2*time.Second)), "conn-ben")

	r.Step(Leave{ConnID: "conn-ben"}, at(3*time.Second))
	expectNoError(t, r.Step(joinAs("ben"), at(4*time.Second)), "conn-ben")

	r.Step(Leave{ConnID: "conn-ana"}, at(5*time.Second))
	expectNoError(t, r.Step(joinAs("ana"), at(6*time.Second)), "conn-ana")
}

func TestTooManyWrongCodesLockTheUserOut(t *testing.T) {
	r := newRoom(t, Settings{Name: "Sala", Event: "3x3", MaxRoundTime: 60, Code: "ABC234"})
	wrong := joinAs("ben")
	wrong.Code = "ZZZZZZ"
	right := joinAs("ben")
	right.Code = "ABC234"

	for i := range 3 {
		expectError(t, r.Step(joinAs("ben"), at(time.Duration(i)*time.Second)), "conn-ben", ErrWrongCode)
	}
	for i := range 5 {
		expectError(t, r.Step(wrong, at(time.Duration(i)*time.Second)), "conn-ben", ErrWrongCode)
	}
	expectError(t, r.Step(right, at(10*time.Second)), "conn-ben", ErrTooManyAttempts)
	expectNoError(t, r.Step(right, at(65*time.Second)), "conn-ben")
}

func TestAFullRoomTurnsNewPlayersAwayButNotReturningOnes(t *testing.T) {
	cfg := DefaultConfig()
	cfg.MaxPlayers = 2
	r := newRoomWith(t, cfg, public)
	r.Step(joinAs("ben"), at(time.Second))

	expectError(t, r.Step(joinAs("carl"), at(2*time.Second)), "conn-carl", ErrFull)

	r.Step(Disconnected{ConnID: "conn-ben"}, at(3*time.Second))
	expectError(t, r.Step(joinAs("carl"), at(4*time.Second)), "conn-carl", ErrFull)
	expectNoError(t, r.Step(joinAs("ben"), at(5*time.Second)), "conn-ben")
}

func confirm(r *Room, userID string, round int, penalty Penalty, now time.Time) []Effect {
	return r.Step(SetPenalty{ConnID: "conn-" + userID, Rid: 8, Round: round, Penalty: penalty}, now)
}

func TestWhenEveryoneConfirmedTheNextRoundStartsAfterTheBreak(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))

	submit(r, "ana", 1, 9_000, at(10*time.Second))
	submit(r, "ben", 1, 11_000, at(12*time.Second))
	confirm(r, "ana", 1, PenaltyOK, at(13*time.Second))
	if !r.state.NextRoundAt.IsZero() {
		t.Fatal("next round scheduled while ben was still choosing his penalty")
	}
	confirm(r, "ben", 1, PenaltyPlus2, at(14*time.Second))
	if wake := r.NextWake(); !wake.Equal(at(17 * time.Second)) {
		t.Fatalf("NextWake = %v, want the 3 s break after the last confirmation", wake)
	}

	fx := r.Step(Tick{}, at(17*time.Second))

	round := only(t, received[RoundEvent](fx, "conn-ben")).Round
	if round.Index != 2 || *round.Scramble != "S2" || round.StartsAt != at(17*time.Second).UnixMilli() {
		t.Fatalf("round = %+v", round)
	}
	for _, p := range only(t, received[MembersEvent](fx, "conn-ana")).Players {
		if p.Status != StatusIdle {
			t.Fatalf("%s kept status %s into the new round", p.UserID, p.Status)
		}
	}
}

func TestTheDeadlineStartsTheNextRound(t *testing.T) {
	r := newRoom(t, public)

	fx := r.Step(Tick{}, at(time.Minute))

	round := only(t, received[RoundEvent](fx, "conn-ana")).Round
	if round.Index != 2 || round.StartsAt != at(time.Minute).UnixMilli() || round.Deadline != at(2*time.Minute).UnixMilli() {
		t.Fatalf("round = %+v", round)
	}
}

func TestALateWakeStartsOneRoundInsteadOfReplayingTheMissedOnes(t *testing.T) {
	r := newRoom(t, public)

	fx := r.Step(Tick{}, at(10*time.Minute))

	round := only(t, received[RoundEvent](fx, "conn-ana")).Round
	if round.Index != 2 || round.StartsAt != at(10*time.Minute).UnixMilli() {
		t.Fatalf("round = %+v", round)
	}
}

func TestSolvesAreChecked(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(30*time.Second))

	cases := map[string]struct {
		in   SubmitSolve
		now  time.Time
		want ErrorCode
	}{
		"not in the room":           {SubmitSolve{ConnID: "conn-zoe", Round: 1, Time: 1_000}, at(40 * time.Second), ErrForbidden},
		"zero time":                 {SubmitSolve{ConnID: "conn-ana", Round: 1, Time: 0}, at(40 * time.Second), ErrInvalid},
		"another round":             {SubmitSolve{ConnID: "conn-ana", Round: 2, Time: 1_000}, at(40 * time.Second), ErrInvalid},
		"longer than the round":     {SubmitSolve{ConnID: "conn-ana", Round: 1, Time: 42_000}, at(40 * time.Second), ErrInvalid},
		"longer than since joining": {SubmitSolve{ConnID: "conn-ben", Round: 1, Time: 12_000}, at(40 * time.Second), ErrInvalid},
	}
	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			expectError(t, r.Step(tc.in, tc.now), tc.in.ConnID, tc.want)
		})
	}

	expectNoError(t, submit(r, "ben", 1, 10_500, at(40*time.Second)), "conn-ben")
	expectError(t, submit(r, "ben", 1, 9_000, at(41*time.Second)), "conn-ben", ErrInvalid)
}

func TestASolveArrivingRightAfterTheDeadlineIsRecordedAsDNF(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(Tick{}, at(time.Minute))

	fx := submit(r, "ana", 1, 58_000, at(61*time.Second))
	expectError(t, submit(r, "ben", 1, 58_000, at(62500*time.Millisecond)), "conn-ben", ErrInvalid)

	if solve := only(t, received[SolveEvent](fx, "conn-ben")).Solve; solve.Round != 1 || *solve.Penalty != PenaltyDNF {
		t.Fatalf("solve = %+v", solve)
	}
	expectError(t, confirm(r, "ana", 1, PenaltyOK, at(61500*time.Millisecond)), "conn-ana", ErrInvalid)
}

func TestPenaltiesCanBeChosenOnceUntilTheRoundEnds(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	fx := submit(r, "ana", 1, 9_000, at(10*time.Second))
	if solve := only(t, received[SolveEvent](fx, "conn-ben")).Solve; solve.ConfirmBy != at(time.Minute).UnixMilli() {
		t.Fatalf("confirmBy = %d, want the round deadline", solve.ConfirmBy)
	}
	submit(r, "ben", 1, 9_500, at(11*time.Second))

	fx = confirm(r, "ana", 1, PenaltyPlus2, at(50*time.Second))
	if solve := only(t, received[SolveEvent](fx, "conn-ben")).Solve; solve.UserID != "ana" || *solve.Penalty != PenaltyPlus2 {
		t.Fatalf("solve = %+v", solve)
	}
	expectError(t, confirm(r, "ana", 1, PenaltyOK, at(51*time.Second)), "conn-ana", ErrInvalid)
	expectError(t, confirm(r, "ben", 1, "maybe", at(51*time.Second)), "conn-ben", ErrInvalid)

	fx = r.Step(Tick{}, at(time.Minute))

	if solve := only(t, received[SolveEvent](fx, "conn-ana")).Solve; solve.UserID != "ben" || *solve.Penalty != PenaltyDNF {
		t.Fatalf("solve = %+v", solve)
	}
	if round := only(t, received[RoundEvent](fx, "conn-ana")).Round; round.Index != 2 {
		t.Fatalf("round = %+v", round)
	}
}

func TestAPenaltyStillPendingWhenTheRoundEndsEarlyBecomesDNF(t *testing.T) {
	r := newRoom(t, public)
	submit(r, "ana", 1, 4_000, at(5*time.Second))
	confirm(r, "ana", 1, PenaltyOK, at(5*time.Second))
	r.Step(joinAs("ben"), at(6*time.Second))
	submit(r, "ben", 1, 500, at(7*time.Second))

	fx := r.Step(Tick{}, at(8*time.Second))

	if solve := only(t, received[SolveEvent](fx, "conn-ben")).Solve; solve.UserID != "ben" || *solve.Penalty != PenaltyDNF {
		t.Fatalf("solve = %+v", solve)
	}
	if r.state.Round.Index != 2 {
		t.Fatalf("round = %d, want 2", r.state.Round.Index)
	}
}

func TestADisconnectWithinTheGraceKeepsSeniorityAndLeadership(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))

	fx := r.Step(Disconnected{ConnID: "conn-ana"}, at(5*time.Second))
	if p := only(t, received[PlayerEvent](fx, "conn-ben")).Player; p.UserID != "ana" || p.Online {
		t.Fatalf("player = %+v", p)
	}

	back := joinAs("ana")
	back.ConnID = "conn-ana-2"
	fx = r.Step(back, at(12*time.Second))

	if len(received[ReplacedEvent](fx, "conn-ana")) != 0 {
		t.Fatal("told a closed connection it was replaced")
	}
	snapshot := only(t, received[SnapshotEvent](fx, "conn-ana-2")).Room
	if *snapshot.LeaderID != "ana" || snapshot.Players[0].JoinedAt != t0.UnixMilli() {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}

func TestAReloadMidSolveKeepsTheSolveRunning(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(5*time.Second))

	r.Step(Disconnected{ConnID: "conn-ben"}, at(8*time.Second))
	back := joinAs("ben")
	back.ConnID = "conn-ben-2"
	fx := r.Step(back, at(9*time.Second))

	ben := only(t, received[SnapshotEvent](fx, "conn-ben-2")).Room.Players[1]
	if ben.Status != StatusSolving || ben.StatusAt != at(5*time.Second).UnixMilli() {
		t.Fatalf("ben = %+v, want still solving since 5 s", ben)
	}
	expectNoError(t, submit(r, "ben", 1, 7_500, at(12500*time.Millisecond)), "conn-ben-2")
}

func TestAfterTheGraceThePlayerLeavesAndLeadershipStaysWithTheSuccessor(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(Disconnected{ConnID: "conn-ana"}, at(5*time.Second))

	fx := r.Step(Tick{}, at(15*time.Second))

	if freed := only(t, effectsOf[SeatFreed](fx)); freed.UserID != "ana" {
		t.Fatalf("freed = %+v", freed)
	}
	if members := only(t, received[MembersEvent](fx, "conn-ben")); *members.LeaderID != "ben" {
		t.Fatalf("leader = %v, want ben", *members.LeaderID)
	}

	fx = r.Step(joinAs("ana"), at(16*time.Second))
	snapshot := only(t, received[SnapshotEvent](fx, "conn-ana")).Room
	if *snapshot.LeaderID != "ben" || !slices.Equal(playerIDs(snapshot.Players), []string{"ben", "ana"}) {
		t.Fatalf("leader %v, players %v", *snapshot.LeaderID, playerIDs(snapshot.Players))
	}
}

func TestLeadershipPrefersTheOldestConnectedPlayer(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(joinAs("carl"), at(2*time.Second))
	r.Step(Disconnected{ConnID: "conn-ben"}, at(3*time.Second))

	r.Step(Leave{ConnID: "conn-ana"}, at(4*time.Second))

	if r.state.LeaderID != "carl" {
		t.Fatalf("leader = %q, want carl", r.state.LeaderID)
	}
}

func TestTheLeaderCanKickAndTheKickedStayOut(t *testing.T) {
	r := newRoom(t, Settings{Name: "Sala", Event: "3x3", MaxRoundTime: 60, Code: "ABC234"})
	join := func(userID string) Join {
		j := joinAs(userID)
		j.Code = "ABC234"
		return j
	}
	r.Step(join("ben"), at(time.Second))
	r.Step(join("carl"), at(2*time.Second))

	expectError(t, r.Step(Kick{ConnID: "conn-ben", Rid: 1, UserID: "carl"}, at(3*time.Second)), "conn-ben", ErrForbidden)
	expectError(t, r.Step(Kick{ConnID: "conn-ana", Rid: 1, UserID: "ana"}, at(3*time.Second)), "conn-ana", ErrInvalid)

	fx := r.Step(Kick{ConnID: "conn-ana", Rid: 1, UserID: "ben"}, at(4*time.Second))

	only(t, received[KickedEvent](fx, "conn-ben"))
	if freed := only(t, effectsOf[SeatFreed](fx)); freed.UserID != "ben" {
		t.Fatalf("freed = %+v", freed)
	}
	if got := playerIDs(only(t, received[MembersEvent](fx, "conn-carl")).Players); !slices.Equal(got, []string{"ana", "carl"}) {
		t.Fatalf("players = %v", got)
	}
	expectError(t, r.Step(join("ben"), at(5*time.Second)), "conn-ben", ErrBanned)
}

func TestTheSameAccountOnAnotherConnectionReplacesTheOldOne(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	submit(r, "ben", 1, 5_000, at(10*time.Second))
	phone := joinAs("ben")
	phone.ConnID = "conn-ben-phone"

	fx := r.Step(phone, at(20*time.Second))

	replaced := only(t, received[ReplacedEvent](fx, "conn-ben"))
	if replaced.RoomID != "room" || replaced.ToRoomID != "room" {
		t.Fatalf("replaced = %+v", replaced)
	}
	snapshot := only(t, received[SnapshotEvent](fx, "conn-ben-phone")).Room
	if snapshot.Players[1].JoinedAt != at(time.Second).UnixMilli() || len(snapshot.Solves) != 1 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
	if fx := r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(21*time.Second)); len(fx) != 0 {
		t.Fatalf("the replaced connection still reports status: %v", fx)
	}
	expectError(t, r.Step(SetPenalty{ConnID: "conn-ben", Rid: 2, Round: 1, Penalty: PenaltyOK}, at(21*time.Second)), "conn-ben", ErrForbidden)
}

func TestMovingToAnotherRoomLeavesAtOnce(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))

	fx := r.Step(Moved{UserID: "ana", ToRoomID: "other"}, at(5*time.Second))

	if replaced := only(t, received[ReplacedEvent](fx, "conn-ana")); replaced.ToRoomID != "other" {
		t.Fatalf("replaced = %+v", replaced)
	}
	if r.state.LeaderID != "ben" || r.state.player("ana") != nil {
		t.Fatalf("leader %q, ana still seated: %v", r.state.LeaderID, r.state.player("ana") != nil)
	}
}

func TestAnEmptyRoomClosesAfterItsTTL(t *testing.T) {
	r := newRoom(t, public)

	r.Step(Leave{ConnID: "conn-ana"}, at(5*time.Second))
	if wake := r.NextWake(); !wake.Equal(at(25 * time.Second)) {
		t.Fatalf("NextWake = %v, want 20 s after it emptied", wake)
	}
	if fx := r.Step(Tick{}, at(24*time.Second)); len(effectsOf[Closed](fx)) != 0 {
		t.Fatal("closed early")
	}

	fx := r.Step(Tick{}, at(25*time.Second))

	only(t, effectsOf[Closed](fx))
	expectError(t, r.Step(joinAs("ben"), at(26*time.Second)), "conn-ben", ErrNotFound)
}

func TestJoiningAnEmptyRoomPastItsDeadlineStartsAFreshRound(t *testing.T) {
	r := newRoom(t, public)
	r.Step(Leave{ConnID: "conn-ana"}, at(50*time.Second))

	fx := r.Step(joinAs("ben"), at(65*time.Second))

	snapshot := only(t, received[SnapshotEvent](fx, "conn-ben")).Room
	if snapshot.Round.Index != 2 || snapshot.Round.StartsAt != at(65*time.Second).UnixMilli() || *snapshot.LeaderID != "ben" {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}

func TestAReloadingPlayerHoldsTheRoundUntilTheirGraceEnds(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(2*time.Second))
	submit(r, "ana", 1, 5_000, at(8*time.Second))
	confirm(r, "ana", 1, PenaltyOK, at(9*time.Second))

	r.Step(Disconnected{ConnID: "conn-ben"}, at(10*time.Second))
	if !r.state.NextRoundAt.IsZero() {
		t.Fatal("the round ended early while ben was reloading")
	}

	r.Step(Tick{}, at(20*time.Second))

	if !r.state.NextRoundAt.Equal(at(23 * time.Second)) {
		t.Fatalf("NextRoundAt = %v, want the break once ben's grace ran out", r.state.NextRoundAt)
	}
}

func TestLeavingMidSolveLeavesADNFSoComingBackGivesNoNewAttempt(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(5*time.Second))
	r.Step(Disconnected{ConnID: "conn-ben"}, at(6*time.Second))

	fx := r.Step(Tick{}, at(16*time.Second))

	if solve := only(t, received[SolveEvent](fx, "conn-ana")).Solve; solve.UserID != "ben" || *solve.Penalty != PenaltyDNF {
		t.Fatalf("solve = %+v", solve)
	}
	back := joinAs("ben")
	back.ConnID = "conn-ben-2"
	r.Step(back, at(17*time.Second))
	retry := SubmitSolve{ConnID: "conn-ben-2", Rid: 9, Round: 1, Time: 1_000}
	expectError(t, r.Step(retry, at(18*time.Second)), "conn-ben-2", ErrInvalid)
}

func TestASolveStillRunningWhenTheRoundEndsIsADNF(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	r.Step(joinAs("carl"), at(time.Second))
	r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(50*time.Second))
	r.Step(ReportStatus{ConnID: "conn-carl", Status: StatusInspecting}, at(55*time.Second))

	fx := r.Step(Tick{}, at(time.Minute))

	var dnfs []string
	for _, event := range received[SolveEvent](fx, "conn-ana") {
		if event.Solve.Round == 1 && *event.Solve.Penalty == PenaltyDNF {
			dnfs = append(dnfs, event.Solve.UserID)
		}
	}
	if !slices.Equal(dnfs, []string{"ben", "carl"}) {
		t.Fatalf("DNFs = %v, want ben and carl", dnfs)
	}
	if r.state.solve("ana", 1) != nil {
		t.Fatal("ana never started, she should have no solve")
	}
}

func TestStatusReportsOnlyAnnounceChanges(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))

	fx := r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusInspecting}, at(2*time.Second))
	if p := only(t, received[PlayerEvent](fx, "conn-ana")).Player; p.Status != StatusInspecting {
		t.Fatalf("player = %+v", p)
	}
	if fx := r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusInspecting}, at(3*time.Second)); len(fx) != 0 {
		t.Fatalf("repeated status produced %v", fx)
	}
	if fx := r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusDone}, at(3*time.Second)); len(fx) != 0 {
		t.Fatalf("a client claimed done: %v", fx)
	}

	submit(r, "ben", 1, 1_500, at(4*time.Second))
	if fx := r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(5*time.Second)); len(fx) != 0 {
		t.Fatalf("status changed after solving: %v", fx)
	}
}

func TestRestoreStartsEveryoneOfflineWithAFullGrace(t *testing.T) {
	r := newRoom(t, public)
	r.Step(joinAs("ben"), at(time.Second))
	saved, err := json.Marshal(r.State())
	if err != nil {
		t.Fatal(err)
	}
	var state State
	if err := json.Unmarshal(saved, &state); err != nil {
		t.Fatal(err)
	}

	restored, fx := Restore(DefaultConfig(), state, at(30*time.Second))
	if len(effectsOf[NeedScrambles](fx)) != 0 {
		t.Fatal("a restored room with a full buffer asked for scrambles")
	}

	if wake := restored.NextWake(); !wake.Equal(at(40 * time.Second)) {
		t.Fatalf("NextWake = %v, want the grace from the restart", wake)
	}
	back := joinAs("ben")
	back.ConnID = "conn-ben-2"
	fx = restored.Step(back, at(35*time.Second))
	if snapshot := only(t, received[SnapshotEvent](fx, "conn-ben-2")).Room; *snapshot.LeaderID != "ana" || len(snapshot.Players) != 2 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}

func TestARestoredRoomStillWaitingAsksForScramblesAgain(t *testing.T) {
	r, _ := New(DefaultConfig(), "room", public, joinAs("ana"), nil, t0)

	_, fx := Restore(DefaultConfig(), r.State(), at(time.Second))

	if need := only(t, effectsOf[NeedScrambles](fx)); need.Count != 4 {
		t.Fatalf("asked for %d scrambles, want 4", need.Count)
	}
}

func TestVersionsOnlyGoUp(t *testing.T) {
	r := newRoom(t, public)
	var last int64
	check := func(fx []Effect) {
		t.Helper()
		for _, b := range effectsOf[Broadcast](fx) {
			raw, _ := json.Marshal(b.Event)
			var probe struct {
				Version *int64 `json:"version"`
			}
			if err := json.Unmarshal(raw, &probe); err != nil || probe.Version == nil {
				t.Fatalf("broadcast without a version: %s", raw)
			}
			if *probe.Version <= last {
				t.Fatalf("version %d after %d", *probe.Version, last)
			}
			last = *probe.Version
		}
	}

	check(r.Step(joinAs("ben"), at(time.Second)))
	check(r.Step(ReportStatus{ConnID: "conn-ben", Status: StatusSolving}, at(2*time.Second)))
	check(submit(r, "ben", 1, 1_000, at(3*time.Second)))
	check(submit(r, "ana", 1, 1_000, at(4*time.Second)))
	check(r.Step(Tick{}, at(7*time.Second)))
}

func TestWireShapes(t *testing.T) {
	p := Player{UserID: "ana", Name: "Ana", JoinedAt: t0, Status: StatusIdle, StatusAt: t0}

	got, _ := json.Marshal(PlayerEvent{Type: "room:player", RoomID: "room", Player: p.view(), Version: 3})

	want := `{"type":"room:player","roomId":"room","player":{"userId":"ana","name":"Ana","image":null,"joinedAt":1700000000000,"status":"idle","statusAt":1700000000000,"online":false},"version":3}`
	if string(got) != want {
		t.Fatalf("got  %s\nwant %s", got, want)
	}
}

func TestNormalizeSettings(t *testing.T) {
	ok, err := NormalizeSettings(Settings{Name: "  Sala  ", Event: "SQ1", MaxRoundTime: 120})
	if err != nil || ok.Name != "Sala" {
		t.Fatalf("got (%+v, %v)", ok, err)
	}

	for name, s := range map[string]Settings{
		"blank name":    {Name: "   ", Event: "3x3", MaxRoundTime: 60},
		"long name":     {Name: "abcdefghijklmnopqrstuvwxyzabcdefghijklmno", Event: "3x3", MaxRoundTime: 60},
		"unknown event": {Name: "Sala", Event: "square1", MaxRoundTime: 60},
		"odd time":      {Name: "Sala", Event: "3x3", MaxRoundTime: 61},
	} {
		if _, err := NormalizeSettings(s); err == nil {
			t.Errorf("%s: accepted %+v", name, s)
		}
	}
}

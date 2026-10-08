package rooms

import "time"

// ProtocolVersion matches ROOM_PROTOCOL_VERSION in packages/contracts/src/rooms.ts.
const ProtocolVersion = 1

type Config struct {
	MaxPlayers      int
	DisconnectGrace time.Duration
	EmptyTTL        time.Duration
	RoundBreak      time.Duration
	SolveTolerance  time.Duration
	LateSubmit      time.Duration
	ScrambleBuffer  int
	RecentRounds    int
	CodeAttempts    int
	CodeLockout     time.Duration
}

func DefaultConfig() Config {
	return Config{
		MaxPlayers:      16,
		DisconnectGrace: 10 * time.Second,
		EmptyTTL:        20 * time.Second,
		RoundBreak:      3 * time.Second,
		SolveTolerance:  time.Second,
		LateSubmit:      2 * time.Second,
		ScrambleBuffer:  3,
		RecentRounds:    25,
		CodeAttempts:    5,
		CodeLockout:     time.Minute,
	}
}

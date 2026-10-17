import type { SolveReplay } from '@/entities/replay/model/types'
import { isRotation, normalizeReplayMoves } from '@/shared/lib/timer/replayMoves'

export interface PlaybackReplay {
  replay: SolveReplay
  skipped: number
}

// Rotations made during inspection are recorded at t=0 ahead of the first turn.
// They become part of the setup, so playback opens on the inspected orientation.
export function buildPlaybackReplay(source: SolveReplay): PlaybackReplay {
  const moves = normalizeReplayMoves(source.moves)

  let skipped = 0
  while (skipped < moves.length && moves[skipped].t === 0 && isRotation(moves[skipped].m)) skipped++

  if (skipped === 0 || skipped === moves.length) {
    return { replay: moves === source.moves ? source : { ...source, moves }, skipped: 0 }
  }

  const setup = moves
    .slice(0, skipped)
    .map((move) => move.m)
    .join(' ')
  return {
    replay: {
      ...source,
      scramble: [source.scramble, setup].filter(Boolean).join(' '),
      moves: moves.slice(skipped)
    },
    skipped
  }
}

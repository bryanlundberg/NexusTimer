import { analyzeSolution, type TimedMove } from 'cube-state-engine'
import { normalizeReplayMoves } from '@/shared/lib/timer/replayMoves'

export function tryAnalyzeSolution(moves: TimedMove[]) {
  if (!moves.length) return null
  try {
    return analyzeSolution(normalizeReplayMoves(moves))
  } catch {
    return null
  }
}

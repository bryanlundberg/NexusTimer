import { analyzeSolution, type TimedMove } from 'cube-state-engine'

export function tryAnalyzeSolution(moves: TimedMove[]) {
  if (!moves.length) return null
  try {
    return analyzeSolution(moves)
  } catch {
    return null
  }
}

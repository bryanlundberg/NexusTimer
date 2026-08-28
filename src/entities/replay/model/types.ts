import type { TimedMove } from 'cube-state-engine'

export interface SolveReplay {
  version: 1
  puzzle: string
  scramble: string
  durationMs: number
  moves: TimedMove[]
}

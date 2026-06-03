export interface ReplayMove {
  m: string
  t: number
}

export interface SolveReplay {
  version: 1
  puzzle: string
  scramble: string
  durationMs: number
  moves: ReplayMove[]
}

import { invertAlgorithm } from '@/features/trainer/lib/trainerUtils'
import type { SolveReplay } from '@/entities/replay/model/types'

export function buildAlgorithmReplay(alg: string, puzzle: string, moveMs: number): SolveReplay | null {
  const tokens = alg.replace(/[()]/g, '').trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return null

  return {
    version: 1,
    puzzle,
    scramble: invertAlgorithm(alg),
    durationMs: tokens.length * moveMs,
    moves: tokens.map((m, i) => ({ m, t: (i + 1) * moveMs }))
  }
}

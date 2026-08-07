import { invertAlgorithm } from '@/features/trainer/lib/trainerUtils'
import { yellowOrientationSetupAlg } from '@/shared/lib/algorithms/vizConfig'
import type { SolveReplay } from '@/entities/replay/model/types'

/**
 * Builds the replay the algorithm preview modal plays: the case is the inverted
 * algorithm, so playing it forward solves the cube. The scramble carries the same
 * yellow-layer rotation the cards use (see applyYellowOrientation) so the modal
 * opens on the state its card was showing, rather than upside down.
 */
export function buildAlgorithmReplay(alg: string, puzzle: string, moveMs: number): SolveReplay | null {
  const tokens = alg.replace(/[()]/g, '').trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return null

  return {
    version: 1,
    puzzle,
    scramble: [yellowOrientationSetupAlg(puzzle), invertAlgorithm(alg)].filter(Boolean).join(' '),
    durationMs: tokens.length * moveMs,
    moves: tokens.map((m, i) => ({ m, t: (i + 1) * moveMs }))
  }
}

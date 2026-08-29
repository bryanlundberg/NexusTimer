import { Alg, Move } from '@rednaxela101/cubing/alg'
import { invertAlgorithm, isSquare1Alg } from '@/shared/lib/algorithms/algNotation'
import { yellowOrientationSetupAlg } from '@/shared/lib/algorithms/vizConfig'
import type { SolveReplay } from '@/entities/replay/model/types'

/**
 * Square-1 moves cannot be split on whitespace, and a `(x,y)` tuple is a grouping
 * rather than a move: `experimentalAddMove` only takes moves, so feeding it the
 * tuple silently did nothing and only the `/` slices animated. Expanding the alg
 * turns each tuple into its `U_SQ_` / `D_SQ_` moves. Zero-amount halves (the `0`
 * in `(3,0)`) are dropped so they do not take a turn of playback doing nothing.
 */
function tokenize(alg: string): string[] {
  if (isSquare1Alg(alg)) {
    return [...new Alg(alg).experimentalExpand()]
      .filter((node) => !(node instanceof Move) || node.amount !== 0)
      .map((node) => node.toString())
  }
  return alg.replace(/[()]/g, '').trim().split(/\s+/).filter(Boolean)
}

/**
 * Builds the replay the algorithm preview modal plays: it opens on the case the
 * card thumbnail shows (`alg⁻¹` from solved, see applyYellowOrientation) and plays
 * the algorithm forward, so the reproduction ends solved. The scramble also
 * carries the yellow-layer rotation those thumbnails use, so the modal is not
 * upside down relative to the card.
 *
 * Returns null when the alg does not parse, so a bad entry leaves the preview
 * empty instead of throwing while the modal renders.
 */
export function buildAlgorithmReplay(alg: string, puzzle: string, moveMs: number): SolveReplay | null {
  try {
    const tokens = tokenize(alg)
    if (tokens.length === 0) return null

    return {
      version: 1,
      puzzle,
      scramble: [yellowOrientationSetupAlg(puzzle), invertAlgorithm(alg)].filter(Boolean).join(' '),
      durationMs: tokens.length * moveMs,
      moves: tokens.map((m, i) => ({ m, t: (i + 1) * moveMs }))
    }
  } catch {
    return null
  }
}

import { expandAlg, formatMove, parseAlg, type LeafNode } from '@nexustimer/cubelet'
import { invertAlgorithm, isSquare1Alg } from '@/shared/lib/algorithms/algNotation'
import { yellowOrientationSetupAlg } from '@/shared/lib/algorithms/vizConfig'
import type { SolveReplay } from '@/entities/replay/model/types'

const square1Token = (node: LeafNode): string => {
  if (node.kind === 'slash') return '/'
  if (node.kind === 'move') return formatMove(node)
  return `(${node.first},${node.second})`
}

function tokenize(alg: string): string[] {
  if (isSquare1Alg(alg)) return expandAlg(parseAlg(alg)).map(square1Token)
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

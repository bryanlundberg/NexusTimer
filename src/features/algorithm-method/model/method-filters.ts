import { ALGORITHM_SETS, type ALGORITHM_SET } from '@/shared/const/algorithms-sets'

export type MethodPuzzle = ALGORITHM_SET['puzzle']

export const PUZZLE_LABELS: Record<MethodPuzzle, string> = {
  '2x2x2': '2x2',
  '3x3x3': '3x3',
  '4x4x4': '4x4',
  '5x5x5': '5x5',
  pyraminx: 'Pyraminx'
}

function buildPuzzleFacets() {
  const counts = {} as Record<MethodPuzzle, number>
  const order: MethodPuzzle[] = []

  for (const set of ALGORITHM_SETS) {
    if (counts[set.puzzle] === undefined) {
      counts[set.puzzle] = 0
      order.push(set.puzzle)
    }
    counts[set.puzzle] += 1
  }

  return { order, counts }
}

const facets = buildPuzzleFacets()

/** Puzzles in the order they first appear in ALGORITHM_SETS, so chips follow the grid. */
export const PUZZLE_ORDER: readonly MethodPuzzle[] = facets.order
export const PUZZLE_COUNTS: Readonly<Record<MethodPuzzle, number>> = facets.counts

export function togglePuzzle(puzzles: MethodPuzzle[], puzzle: MethodPuzzle): MethodPuzzle[] {
  return puzzles.includes(puzzle) ? puzzles.filter((item) => item !== puzzle) : [...puzzles, puzzle]
}

export function filterMethods(sets: readonly ALGORITHM_SET[], puzzles: MethodPuzzle[]): ALGORITHM_SET[] {
  if (puzzles.length === 0) return [...sets]
  return sets.filter((set) => puzzles.includes(set.puzzle))
}

export function countAlgorithms(sets: readonly ALGORITHM_SET[]): number {
  return sets.reduce((sum, set) => sum + set.algorithms.length, 0)
}

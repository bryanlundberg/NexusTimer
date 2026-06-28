import { ALGORITHM_SETS, type ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import type { LearnedMethod } from '@/entities/trainer-learned/model/useUserLearned'

export interface LearnedCase {
  id: string
  name: string
  group: string
  moves?: string
}

export interface LearnedMethodView {
  set: ALGORITHM_SET
  learnedCount: number
  total: number
  percent: number
  cases: LearnedCase[]
}

export interface LearnedMethodsByPuzzle {
  puzzle: string
  methods: LearnedMethodView[]
}

export interface BuiltLearnedMethods {
  total: number
  byPuzzle: LearnedMethodsByPuzzle[]
}

/**
 * Joins the raw per-method learned counts coming from the API with the static
 * ALGORITHM_SETS catalog, producing a view-model grouped by puzzle. Only
 * methods with at least one learned case are included.
 */
export function buildLearnedMethods(methods: LearnedMethod[] | undefined): BuiltLearnedMethods {
  if (!methods || methods.length === 0) return { total: 0, byPuzzle: [] }

  const learnedBySlug = new Map<string, LearnedMethod>(methods.map((m) => [m.methodSlug, m]))

  const views: LearnedMethodView[] = []
  let total = 0

  for (const set of ALGORITHM_SETS) {
    const learned = learnedBySlug.get(set.slug)
    if (!learned || learned.count === 0) continue

    const learnedIds = new Set(learned.caseIds)
    const setAlgorithms = set.algorithms as ReadonlyArray<AlgorithmCollection>

    const cases: LearnedCase[] = setAlgorithms
      .filter((alg) => learnedIds.has(alg.id))
      .map((alg) => ({
        id: alg.id,
        name: alg.name,
        group: alg.group,
        moves: alg.algs?.[0]?.moves
      }))

    // Count only cases that still exist in the catalog (guards against stale ids).
    const learnedCount = cases.length
    if (learnedCount === 0) continue

    const totalCases = setAlgorithms.length
    const percent = totalCases > 0 ? Math.round((learnedCount / totalCases) * 100) : 0

    views.push({ set, learnedCount, total: totalCases, percent, cases })
    total += learnedCount
  }

  const byPuzzleMap = new Map<string, LearnedMethodView[]>()
  for (const view of views) {
    const puzzle = view.set.puzzle
    const list = byPuzzleMap.get(puzzle) ?? []
    list.push(view)
    byPuzzleMap.set(puzzle, list)
  }

  const byPuzzle: LearnedMethodsByPuzzle[] = Array.from(byPuzzleMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([puzzle, methods]) => ({ puzzle, methods }))

  return { total, byPuzzle }
}

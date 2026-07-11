import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import type { ALGORITHM_SET } from '@/shared/const/algorithms-sets'

// A case needs this many attempts before it can be ranked best/worst algorithm
export const MIN_ATTEMPTS_TO_RANK = 3
export const BEST_COUNT = 3
export const WORST_COUNT = 3

export interface RankedCase {
  algCase: AlgorithmCollection
  avgMs: number
  attempts: number
}

export interface MethodOverviewSummary {
  totalSolves: number
  avgMs: number | null
  bestSingleMs: number | null
  practicedCount: number
  best: RankedCase[]
  worst: RankedCase[]
}

export function computeMethodOverview(stats: TrainerMethodStatsDoc | null, set: ALGORITHM_SET): MethodOverviewSummary {
  const cases = stats?.cases ?? {}
  const catalogById = new Map(set.algorithms.map((a) => [a.id, a]))

  const ranked: RankedCase[] = []
  let practiced = 0

  for (const [caseId, cs] of Object.entries(cases)) {
    const algCase = catalogById.get(caseId)
    if (!algCase || cs.totalSolves === 0) continue
    practiced += 1
    if (cs.totalSolves < MIN_ATTEMPTS_TO_RANK) continue

    // Recent window reflects current skill better than the lifetime average.
    const recent = cs.recentTimes ?? []
    const avg =
      recent.length >= MIN_ATTEMPTS_TO_RANK
        ? recent.reduce((acc, v) => acc + v, 0) / recent.length
        : cs.totalTimeMs / cs.totalSolves

    ranked.push({ algCase, avgMs: avg, attempts: cs.totalSolves })
  }

  ranked.sort((a, b) => a.avgMs - b.avgMs)

  return {
    totalSolves: stats?.totalSolves ?? 0,
    avgMs: stats && stats.totalSolves > 0 ? stats.totalTimeMs / stats.totalSolves : null,
    bestSingleMs: stats?.bestSingleMs ?? null,
    practicedCount: practiced,
    // Fastest first.
    best: ranked.slice(0, BEST_COUNT),
    // Slowest first; never overlaps with the best cases.
    worst: ranked.slice(BEST_COUNT).slice(-WORST_COUNT).reverse()
  }
}

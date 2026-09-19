import type { SolveStats } from '@/entities/achievement/model/types'
import type { SerializedSolveStats } from '@/entities/user-stats/model/types'

export function serializeSolveStats(stats: SolveStats): SerializedSolveStats {
  return {
    ...stats,
    bestByCategory: Object.fromEntries(stats.bestByCategory),
    countByCategory: Object.fromEntries(stats.countByCategory)
  }
}

export function deserializeSolveStats(stats: SerializedSolveStats): SolveStats {
  return {
    ...stats,
    bestByCategory: new Map(Object.entries(stats.bestByCategory)),
    countByCategory: new Map(Object.entries(stats.countByCategory))
  }
}

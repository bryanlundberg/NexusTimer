import { useMemo } from 'react'
import { UserProfile } from '@/entities/user/model/user'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'
import { deserializeSolveStats } from '@/entities/user-stats/lib/solve-stats-serialization'
import { computeSolveStats } from './achievements'
import { resolveBadgesFromStats } from './resolve-badges'

export type { UserBadge, UserBadgesResult, BadgeFamily, BadgeProgress } from './resolve-badges'

export default function useUserBadges({ user, stats }: { user: UserProfile; stats: UserStatsSummary | null }) {
  return useMemo(
    () =>
      resolveBadgesFromStats({
        user,
        stats: stats ? deserializeSolveStats(stats.achievements.solveStats) : computeSolveStats([]),
        cubeCount: stats?.achievements.cubeCount ?? 0
      }),
    [stats, user]
  )
}

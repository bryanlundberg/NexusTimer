import { useMemo } from 'react'
import { Cube } from '@/entities/cube/model/types'
import { UserDocument } from '@/entities/user/model/user'
import { Achievement } from './types'
import { ACHIEVEMENTS_CONFIG, computeSolveStats } from './achievements'

export interface UserBadge extends Achievement {
  unlocked: boolean
}

export interface UserBadgesResult {
  badges: UserBadge[]
  unlocked: UserBadge[]
  locked: UserBadge[]
  total: number
}

/**
 * Resolves the unlock state of every badge for a user. Aggregates over the
 * solve set are computed exactly once and reused across all predicates.
 *
 * Call this **once per profile** (in `PeopleTabs`) and pass the result down
 * via props — otherwise each consumer re-runs the full O(N) sweep.
 */
export default function useUserBadges({ user, cubes }: { user: UserDocument; cubes: Cube[] }): UserBadgesResult {
  return useMemo(() => {
    const stats = computeSolveStats(cubes)
    const grantedKeys = new Set(user.grantedAchievements ?? [])
    const data = { cubes, user, stats }

    const badges: UserBadge[] = ACHIEVEMENTS_CONFIG.map((achievement) => {
      const unlocked =
        achievement.type === 'granted' ? grantedKeys.has(achievement.id) : Boolean(achievement.condition?.(data))
      return { ...achievement, unlocked }
    })

    return {
      badges,
      unlocked: badges.filter((b) => b.unlocked),
      locked: badges.filter((b) => !b.unlocked),
      total: badges.length
    }
  }, [cubes, user])
}

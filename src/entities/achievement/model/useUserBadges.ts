import { useMemo } from 'react'
import { Cube } from '@/entities/cube/model/types'
import { UserProfile } from '@/entities/user/model/user'
import { resolveBadges } from './resolve-badges'

export type { UserBadge, UserBadgesResult, BadgeFamily, BadgeProgress } from './resolve-badges'

/**
 * Resolves the unlock state of every badge for a user.
 *
 * Call this **once per profile** (in `PeopleTabs`) and pass the result down
 * via props — otherwise each consumer re-runs the full O(N) sweep.
 */
export default function useUserBadges({ user, cubes }: { user: UserProfile; cubes: Cube[] }) {
  return useMemo(() => resolveBadges({ user, cubes }), [cubes, user])
}

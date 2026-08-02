import { Cube } from '@/entities/cube/model/types'
import { UserProfile } from '@/entities/user/model/user'
import { Achievement, AchievementData, AchievementType, satisfiesThreshold } from './types'
import { ACHIEVEMENTS_CONFIG, computeSolveStats } from './achievements'

/** A single earnable thing: one tier of a family, or a standalone badge. */
export interface UserBadge {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  type: AchievementType
  unlocked: boolean
  familyId: string
  level: number
}

/** A badge family collapsed to the single entry the profile should render. */
export interface BadgeFamily {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  type: AchievementType
  unlocked: boolean
  level: number
  maxLevel: number
  value?: number
  next?: number
  tiers: UserBadge[]
}

export interface UserBadgesResult {
  badges: UserBadge[]
  unlocked: UserBadge[]
  locked: UserBadge[]
  total: number
  families: BadgeFamily[]
}

function resolveFamily(achievement: Achievement, data: AchievementData, grantedKeys: Set<string>): BadgeFamily {
  if (achievement.type !== 'tiered') {
    const unlocked =
      achievement.type === 'granted' ? grantedKeys.has(achievement.id) : Boolean(achievement.condition?.(data))

    const badge: UserBadge = {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      color: achievement.color,
      type: achievement.type,
      unlocked,
      familyId: achievement.id,
      level: 1
    }

    return { ...badge, level: unlocked ? 1 : 0, maxLevel: 1, tiers: [badge] }
  }

  const value = achievement.metric(data)

  const tiers: UserBadge[] = achievement.tiers.map((tier) => ({
    id: tier.id,
    title: tier.title,
    description: tier.description,
    icon: tier.icon ?? achievement.icon,
    color: tier.color ?? achievement.color,
    type: 'tiered' as const,
    unlocked: satisfiesThreshold(value, tier.threshold, achievement.compare),
    familyId: achievement.id,
    level: tier.level
  }))

  // Tiers run easiest to hardest, so the last satisfied one is the highest held.
  let level = 0
  for (let i = 0; i < tiers.length; i++) {
    if (tiers[i].unlocked) level = i + 1
  }

  // Locked families advertise the first rung rather than going blank.
  const active = level > 0 ? tiers[level - 1] : tiers[0]

  return {
    id: achievement.id,
    title: active.title,
    description: active.description,
    icon: active.icon,
    color: active.color,
    type: 'tiered',
    unlocked: level > 0,
    level,
    maxLevel: tiers.length,
    value,
    next: level < achievement.tiers.length ? achievement.tiers[level].threshold : undefined,
    tiers
  }
}

export function resolveBadges({ user, cubes }: { user: UserProfile; cubes: Cube[] }): UserBadgesResult {
  const stats = computeSolveStats(cubes)
  const grantedKeys = new Set(user.grantedAchievements ?? [])
  const data: AchievementData = { cubes, user, stats }

  const families = ACHIEVEMENTS_CONFIG.map((achievement) => resolveFamily(achievement, data, grantedKeys))
  const badges = families.flatMap((family) => family.tiers)

  return {
    badges,
    unlocked: badges.filter((b) => b.unlocked),
    locked: badges.filter((b) => !b.unlocked),
    total: badges.length,
    families
  }
}

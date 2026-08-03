import { Cube } from '@/entities/cube/model/types'
import { UserProfile } from '@/entities/user/model/user'
import { Achievement, AchievementData, AchievementType, TieredAchievement, satisfiesThreshold } from './types'
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

export interface BadgeProgress {
  ratio?: number
  label: string
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
  progress?: BadgeProgress
  tiers: UserBadge[]
}

function computeProgress(achievement: TieredAchievement, value: number, level: number): BadgeProgress | undefined {
  const target = achievement.tiers[level]?.threshold
  if (target === undefined) return undefined

  if (achievement.formatValue) {
    return { label: `${achievement.formatValue(value)} -> ${achievement.formatValue(target)}` }
  }

  const floor = level > 0 ? achievement.tiers[level - 1].threshold : 0
  const span = target - floor
  const ratio = span > 0 ? Math.min(1, Math.max(0, (value - floor) / span)) : 0
  const unit = achievement.unit ? ` ${achievement.unit}` : ''

  // Explicit locale: the bare `toLocaleString()` follows the runtime's locale,
  // which can differ between server render and client hydration.
  const fmt = (n: number) => n.toLocaleString('en-US')

  return { ratio, label: `${fmt(value)} / ${fmt(target)}${unit}` }
}

export interface UserBadgesResult {
  families: BadgeFamily[]
  unlockedFamilies: BadgeFamily[]
  lockedFamilies: BadgeFamily[]
  earnedTiers: number
  totalTiers: number
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

  let icon = achievement.icon
  let color = achievement.color

  const tiers: UserBadge[] = achievement.tiers.map((tier) => {
    if (tier.icon) icon = tier.icon
    if (tier.color) color = tier.color

    return {
      id: tier.id,
      title: tier.title,
      description: tier.description,
      icon,
      color,
      type: 'tiered' as const,
      unlocked: satisfiesThreshold(value, tier.threshold, achievement.compare),
      familyId: achievement.id,
      level: tier.level
    }
  })

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
    progress: computeProgress(achievement, value, level),
    tiers
  }
}

export function resolveBadges({ user, cubes }: { user: UserProfile; cubes: Cube[] }): UserBadgesResult {
  const stats = computeSolveStats(cubes)
  const grantedKeys = new Set(user.grantedAchievements ?? [])
  const data: AchievementData = { cubes, user, stats }

  const families = ACHIEVEMENTS_CONFIG.map((achievement) => resolveFamily(achievement, data, grantedKeys))

  let earnedTiers = 0
  let totalTiers = 0
  for (const family of families) {
    earnedTiers += family.level
    totalTiers += family.maxLevel
  }

  return {
    families,
    unlockedFamilies: families.filter((f) => f.unlocked),
    lockedFamilies: families.filter((f) => !f.unlocked),
    earnedTiers,
    totalTiers
  }
}

import { Cube } from '@/entities/cube/model/types'
import { UserProfile } from '@/entities/user/model/user'

export type AchievementType = 'computed' | 'granted' | 'tiered'

export type TierCompare = 'gte' | 'gt' | 'lte' | 'lt'

export function satisfiesThreshold(value: number, threshold: number, compare: TierCompare): boolean {
  switch (compare) {
    case 'gte':
      return value >= threshold
    case 'gt':
      return value > threshold
    case 'lte':
      return value <= threshold
    case 'lt':
      return value < threshold
  }
}

interface AchievementBase {
  id: string
  icon: string
  color?: string
}

export interface AchievementTier {
  id: string
  level: number
  title: string
  description: string
  threshold: number
  icon?: string
  color?: string
}

export interface SimpleAchievement extends AchievementBase {
  type: 'computed' | 'granted'
  title: string
  description: string
  condition?: (data: AchievementData) => boolean
}

export interface TieredAchievement extends AchievementBase {
  type: 'tiered'
  metric: (data: AchievementData) => number
  compare: TierCompare
  tiers: AchievementTier[]
  unit?: string
  formatValue?: (value: number) => string
}

export type Achievement = SimpleAchievement | TieredAchievement

export interface RenderableBadge {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  type: AchievementType
}

export function isTiered(achievement: Achievement): achievement is TieredAchievement {
  return achievement.type === 'tiered'
}

export interface SolveStats {
  totalValid: number
  best3x3Single: number
  best3x3OHSingle: number
  bldSuccessCount: number
  newYearSolveCount: number
  replayCount: number
  max3x3SolvesPerCube: number
  categoriesWithValidSolves: Set<string>
  maxSolvesInOneDay: number
  longestDateStreak: number
  longestCleanStreak: number
  bookmarkCount: number
  commentCount: number
}

export interface AchievementData {
  cubes: Cube[]
  user: UserProfile
  stats: SolveStats
}

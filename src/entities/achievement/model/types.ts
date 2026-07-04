import { Cube } from '@/entities/cube/model/types'
import { UserDocument } from '@/entities/user/model/user'

export type AchievementType = 'computed' | 'granted'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  type: AchievementType
  condition?: (data: AchievementData) => boolean
}

export interface SolveStats {
  totalValid: number
  has3x3Sub10: boolean
  has3x3Sub8: boolean
  hasOHSub30: boolean
  hasBLDSuccess: boolean
  hasNewYearSolve: boolean
  max3x3SolvesPerCube: number
  categoriesWithValidSolves: Set<string>
  maxSolvesInOneDay: number
  longestDateStreak: number
  longestCleanStreak: number
  bookmarkCount: number
  commentCount: number
  hasReplay: boolean
}

export interface AchievementData {
  cubes: Cube[]
  user: UserDocument
  stats: SolveStats
}

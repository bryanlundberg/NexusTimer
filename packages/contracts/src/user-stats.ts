import type { CubeCategory } from './cube-categories'
import type { SolveReplayPayload } from './solves'

export const USER_STATS_VERSION = 1

export const RECENT_SOLVES_LIMIT = 25

export interface StatRecord {
  time: number
  cubeName: string
  endTime: number
}

export interface AoWindowSolve {
  id: string
  time: number
  dnf: boolean
  plus2: boolean
}

export interface RecordSolve {
  id: string
  cubeId: string
  scramble: string
  startTime: number
  endTime: number
  bookmark: boolean
  time: number
  rating: number
  dnf: boolean
  plus2: boolean
  replay?: SolveReplayPayload
}

export interface CategoryStats {
  category: CubeCategory
  count: number
  best: (StatRecord & { solve?: RecordSolve }) | null
  bestAo5: (StatRecord & { window: AoWindowSolve[]; solves?: RecordSolve[] }) | null
}

export interface CubeStats {
  id: string
  name: string
  category: CubeCategory
  createdAt: number
  best: number | null
  bestAo5: number | null
  totalTime: number
  counts: { ok: number; plus2: number; dnf: number }
}

export interface RecentSolve {
  id: string
  time: number
  startTime: number
  scramble: string
  dnf: boolean
  plus2: boolean
  category: CubeCategory
  cubeName: string
}

export interface SerializedSolveStats {
  totalValid: number
  bestByCategory: Record<string, number>
  countByCategory: Record<string, number>
  totalTimeSpent: number
  newYearSolveCount: number
  replayCount: number
  max3x3SolvesPerCube: number
  maxSolvesInOneDay: number
  longestDateStreak: number
  longestCleanStreak: number
  bookmarkCount: number
  commentCount: number
}

export interface UserStatsSummary {
  version: number
  timezone: string
  totalSolves: number
  categories: CategoryStats[]
  cubes: CubeStats[]
  recentSolves: RecentSolve[]
  achievements: { solveStats: SerializedSolveStats; cubeCount: number }
}

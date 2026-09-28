import type { FriendUser } from '@/entities/friendship/model/types'
import { CUBE_CATEGORIES, type CubeCategory } from '@/shared/const/cube-categories'

export interface FriendRankingCategory {
  category: CubeCategory
  count: number
  best: number | null
  bestAo5: number | null
}

export interface FriendRankingEntry {
  user: FriendUser
  isSelf: boolean
  updatedAt: number
  totalSolves: number
  timeSpent: number
  longestStreak: number
  categories: FriendRankingCategory[]
}

export interface FriendsRankingResponse {
  friendCount: number
  entries: FriendRankingEntry[]
}

export const OVERALL = 'overall'

export const CATEGORY_METRICS = ['single', 'ao5', 'solves'] as const
export const OVERALL_METRICS = ['solves', 'time', 'streak'] as const

export type CategoryMetric = (typeof CATEGORY_METRICS)[number]
export type OverallMetric = (typeof OVERALL_METRICS)[number]
export type RankingMetric = CategoryMetric | OverallMetric

export type RankingSelection =
  { category: typeof OVERALL; metric: OverallMetric } | { category: CubeCategory; metric: CategoryMetric }

export interface RankedFriend {
  entry: FriendRankingEntry
  rank: number
  value: number
}

const positive = (value: number | null | undefined) => (value && value > 0 ? value : null)

function metricValue(entry: FriendRankingEntry, selection: RankingSelection): number | null {
  if (selection.category === OVERALL) {
    if (selection.metric === 'solves') return positive(entry.totalSolves)
    if (selection.metric === 'time') return positive(entry.timeSpent)
    return positive(entry.longestStreak)
  }

  const stats = entry.categories.find((item) => item.category === selection.category)
  if (!stats) return null
  if (selection.metric === 'single') return positive(stats.best)
  if (selection.metric === 'ao5') return positive(stats.bestAo5)
  return positive(stats.count)
}

export const isTimeMetric = (metric: RankingMetric) => metric === 'single' || metric === 'ao5'

export function rankFriends(entries: FriendRankingEntry[], selection: RankingSelection): RankedFriend[] {
  const direction = isTimeMetric(selection.metric) ? 1 : -1

  const scored = entries
    .flatMap((entry) => {
      const value = metricValue(entry, selection)
      return value === null ? [] : [{ entry, value }]
    })
    .sort((a, b) => direction * (a.value - b.value) || a.entry.user.name.localeCompare(b.entry.user.name))

  let rank = 0
  return scored.map((item, index) => {
    if (index === 0 || item.value !== scored[index - 1].value) rank = index + 1
    return { ...item, rank }
  })
}

export function rankedCategories(entries: FriendRankingEntry[]): CubeCategory[] {
  return CUBE_CATEGORIES.filter((category) =>
    entries.some((entry) => entry.categories.some((item) => item.category === category && item.count > 0))
  )
}

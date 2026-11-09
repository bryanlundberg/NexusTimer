import { type CubeCategory, USER_STATS_VERSION } from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { UserStatsModel } from '../users/user-stats.model'

type BestRecord = { time: number; endTime: number } | null

export type CategoryBests = {
  category: CubeCategory
  count: number
  single: BestRecord
  ao5: BestRecord
}

export type UserBests = { userId: string; categories: CategoryBests[] }

export type FriendsLeaderboardRepository = {
  bests(userIds: string[]): Promise<UserBests[]>
}

type RawRecord = { time?: number; endTime?: number } | null | undefined

type RawStats = {
  user: Types.ObjectId
  summary?: {
    categories?: { category: CubeCategory; count?: number; best?: RawRecord; bestAo5?: RawRecord }[]
  }
}

const toRecord = (raw: RawRecord): BestRecord =>
  raw && typeof raw.time === 'number' ? { time: raw.time, endTime: raw.endTime ?? 0 } : null

export const friendsLeaderboardRepository: FriendsLeaderboardRepository = {
  async bests(userIds) {
    const ids = [...new Set(userIds)].filter((id) => Types.ObjectId.isValid(id))
    if (ids.length === 0) return []

    const docs = await UserStatsModel.find(
      { user: { $in: ids }, version: USER_STATS_VERSION },
      {
        user: 1,
        'summary.categories.category': 1,
        'summary.categories.count': 1,
        'summary.categories.best.time': 1,
        'summary.categories.best.endTime': 1,
        'summary.categories.bestAo5.time': 1,
        'summary.categories.bestAo5.endTime': 1
      }
    ).lean<RawStats[]>()

    return docs.map((doc) => ({
      userId: doc.user.toString(),
      categories: (doc.summary?.categories ?? []).map((entry) => ({
        category: entry.category,
        count: entry.count ?? 0,
        single: toRecord(entry.best),
        ao5: toRecord(entry.bestAo5)
      }))
    }))
  }
}

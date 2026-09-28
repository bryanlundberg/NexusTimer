import type { Types } from 'mongoose'
import User from '@/entities/user/model/user'
import UserStats from '@/entities/user-stats/model/user-stats'
import { USER_STATS_VERSION, type CategoryStats } from '@/entities/user-stats/model/types'
import { FRIEND_USER_PROJECTION, getFriendIds } from '@/entities/friendship/server/friends'
import type { FriendUser } from '@/entities/friendship/model/types'
import { resolvePrivacy, type PrivacySettings } from '@/entities/privacy/model/types'
import { canViewStats } from '@/entities/privacy/server/stats-visibility'
import type {
  FriendRankingCategory,
  FriendRankingEntry,
  FriendsRankingResponse
} from '@/features/friends/model/friends-ranking'

type RankingUser = Omit<FriendUser, '_id'> & {
  _id: Types.ObjectId
  privacy?: Partial<PrivacySettings>
  backup?: { updatedAt?: number }
}

interface RankingStats {
  user: Types.ObjectId
  backupUpdatedAt: number
  summary: {
    totalSolves: number
    categories: CategoryStats[]
    achievements?: { solveStats?: { totalTimeSpent?: number; longestDateStreak?: number } }
  }
}

const USER_PROJECTION = `${FRIEND_USER_PROJECTION} pronoun privacy.statsVisibility backup.updatedAt`

const STATS_PROJECTION = {
  _id: 0,
  user: 1,
  backupUpdatedAt: 1,
  'summary.totalSolves': 1,
  'summary.categories': 1,
  'summary.achievements.solveStats.totalTimeSpent': 1,
  'summary.achievements.solveStats.longestDateStreak': 1
}

const toCategories = (categories: CategoryStats[]): FriendRankingCategory[] =>
  categories.map(({ category, count, best, bestAo5 }) => ({
    category,
    count,
    best: best?.time ?? null,
    bestAo5: bestAo5?.time ?? null
  }))

export async function getFriendsRanking(userId: string): Promise<FriendsRankingResponse> {
  const friendIds = await getFriendIds(userId)
  const ids = [userId, ...friendIds]

  const [users, stats] = await Promise.all([
    User.find({ _id: { $in: ids } })
      .select(USER_PROJECTION)
      .lean<RankingUser[]>(),
    UserStats.find({ user: { $in: ids }, version: USER_STATS_VERSION }, STATS_PROJECTION).lean<RankingStats[]>()
  ])

  const statsByUser = new Map(stats.map((doc) => [String(doc.user), doc]))

  const entries = users.flatMap<FriendRankingEntry>(({ _id, privacy, backup, ...profile }) => {
    const id = String(_id)
    const doc = statsByUser.get(id)
    if (!doc || doc.backupUpdatedAt !== backup?.updatedAt) return []
    if (!canViewStats(resolvePrivacy(privacy).statsVisibility, id, userId, true)) return []

    const solveStats = doc.summary.achievements?.solveStats
    return [
      {
        user: { ...profile, _id: id },
        isSelf: id === userId,
        updatedAt: doc.backupUpdatedAt,
        totalSolves: doc.summary.totalSolves ?? 0,
        timeSpent: solveStats?.totalTimeSpent ?? 0,
        longestStreak: solveStats?.longestDateStreak ?? 0,
        categories: toCategories(doc.summary.categories ?? [])
      }
    ]
  })

  return { friendCount: friendIds.length, entries }
}

import { NextRequest } from 'next/server'
import { Types } from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import UserStats, { type UserStatsDocument } from '@/entities/user-stats/model/user-stats'
import { userStatsCache, type CachedUserStats } from '@/entities/user-stats/model/user-stats-cache'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'
import { auth } from '@/shared/config/auth/auth'
import { statsVisibleTo } from '@/entities/privacy/server/stats-visibility'
import { badRequest, ok, serverError } from '@/shared/api/responses'

const isFresh = (stats: CachedUserStats | null, backupUpdatedAt: number | undefined): stats is CachedUserStats =>
  !!stats && stats.version === USER_STATS_VERSION && stats.backupUpdatedAt === backupUpdatedAt

async function currentBackupUpdatedAt(userId: string): Promise<number | undefined> {
  const profile = await userProfileCache.get(userId)
  if (profile) return profile.backup?.updatedAt

  const user = await User.findById(userId).select('backup.updatedAt').lean<{ backup?: { updatedAt?: number } }>()
  return user?.backup?.updatedAt
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id
    if (!userId) return badRequest('ID is required')
    if (!Types.ObjectId.isValid(userId)) return ok({ stats: null })

    await connectDB()

    const session = await auth()
    if (!(await statsVisibleTo(userId, session?.user?.id))) return ok({ stats: null, hidden: true })

    const [backupUpdatedAt, cached] = await Promise.all([currentBackupUpdatedAt(userId), userStatsCache.get(userId)])
    if (isFresh(cached, backupUpdatedAt)) return ok({ stats: cached.summary })

    const doc = await UserStats.findOne({ user: userId })
      .select('version backupUpdatedAt summary')
      .lean<Pick<UserStatsDocument, 'version' | 'backupUpdatedAt' | 'summary'>>()
    if (!isFresh(doc, backupUpdatedAt)) return ok({ stats: null })

    const stats = { version: doc.version, backupUpdatedAt: doc.backupUpdatedAt, summary: doc.summary }
    await userStatsCache.set(userId, stats)

    return ok({ stats: stats.summary })
  } catch (error) {
    return serverError('users/[id]/stats:GET', error)
  }
}

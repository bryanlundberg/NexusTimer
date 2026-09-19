import { Types } from 'mongoose'
import User from '@/entities/user/model/user'
import UserStats, { type UserStatsDocument } from '@/entities/user-stats/model/user-stats'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'
import { refreshUserStats } from '@/entities/user-stats/server/refresh-user-stats'

const CONCURRENCY = 5

interface UserRow {
  _id: Types.ObjectId
  backup?: { url?: string; updatedAt?: number }
}

type ExistingStats = Pick<UserStatsDocument, 'user' | 'version' | 'backupUpdatedAt'> & {
  summary?: { timezone?: string }
}

export type RecomputeOutcome = 'rebuilt' | 'fresh' | 'no-backup'

export interface RecomputeBatchResult {
  processed: number
  rebuilt: number
  fresh: number
  failed: { userId: string; error: string }[]
  nextCursor: string | null
}

async function recomputeRow(row: UserRow, existing: ExistingStats | undefined, force: boolean) {
  const url = row.backup?.url
  const backupUpdatedAt = row.backup?.updatedAt
  if (!url || backupUpdatedAt === undefined) return 'no-backup' as const

  const fresh = existing?.version === USER_STATS_VERSION && existing.backupUpdatedAt === backupUpdatedAt
  if (fresh && !force) return 'fresh' as const

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Backup download failed: HTTP ${response.status}`)

  await refreshUserStats({
    userId: String(row._id),
    backup: await response.json(),
    backupUpdatedAt,
    timezone: existing?.summary?.timezone
  })
  return 'rebuilt' as const
}

async function loadExisting(userIds: Types.ObjectId[]): Promise<Map<string, ExistingStats>> {
  const docs = await UserStats.find(
    { user: { $in: userIds } },
    { user: 1, version: 1, backupUpdatedAt: 1, 'summary.timezone': 1, _id: 0 }
  ).lean<ExistingStats[]>()
  return new Map(docs.map((doc) => [String(doc.user), doc]))
}

export async function recomputeUser(userId: string): Promise<RecomputeOutcome | null> {
  const row = await User.findById(userId, { _id: 1, backup: 1 }).lean<UserRow>()
  if (!row) return null

  const existing = await loadExisting([row._id])
  return recomputeRow(row, existing.get(userId), true)
}

export async function recomputeBatch({
  cursor,
  limit,
  force
}: {
  cursor?: string
  limit: number
  force: boolean
}): Promise<RecomputeBatchResult> {
  const rows = await User.find(
    { 'backup.url': { $exists: true, $ne: null }, ...(cursor && { _id: { $gt: new Types.ObjectId(cursor) } }) },
    { _id: 1, backup: 1 }
  )
    .sort({ _id: 1 })
    .limit(limit)
    .lean<UserRow[]>()

  const existing = await loadExisting(rows.map((row) => row._id))
  const result: RecomputeBatchResult = { processed: rows.length, rebuilt: 0, fresh: 0, failed: [], nextCursor: null }

  for (let start = 0; start < rows.length; start += CONCURRENCY) {
    await Promise.all(
      rows.slice(start, start + CONCURRENCY).map(async (row) => {
        const userId = String(row._id)
        try {
          const outcome = await recomputeRow(row, existing.get(userId), force)
          if (outcome === 'rebuilt') result.rebuilt++
          else if (outcome === 'fresh') result.fresh++
        } catch (error) {
          result.failed.push({ userId, error: error instanceof Error ? error.message : String(error) })
        }
      })
    )
  }

  result.nextCursor = rows.length === limit ? String(rows[rows.length - 1]._id) : null
  return result
}

import type { Cube } from '@/entities/cube/model/types'
import { filterCubes } from '@/entities/cube/lib/filterCubes'
import { normalizeOldData, preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'
import UserStats from '@/entities/user-stats/model/user-stats'
import { userStatsCache } from '@/entities/user-stats/model/user-stats-cache'
import { computeUserStats } from '@/entities/user-stats/lib/compute-user-stats'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'

export const DEFAULT_STATS_TIMEZONE = 'UTC'

export async function refreshUserStats({
  userId,
  backup,
  backupUpdatedAt,
  timezone = DEFAULT_STATS_TIMEZONE
}: {
  userId: string
  backup: unknown
  backupUpdatedAt: number
  timezone?: string
}): Promise<void> {
  if (!Array.isArray(backup)) throw new Error('Backup is not an array of cubes')

  const cubes = filterCubes(preventDuplicateDeleteStatus(normalizeOldData(backup as Cube[])))
  const summary = computeUserStats(cubes, timezone)

  const stats = { version: USER_STATS_VERSION, backupUpdatedAt, summary }

  // An older backup misses the filter and collides on the unique index, so it never replaces a newer summary.
  try {
    await UserStats.updateOne(
      { user: userId, backupUpdatedAt: { $lte: backupUpdatedAt } },
      { $set: stats },
      { upsert: true }
    )
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) return
    throw error
  }

  await userStatsCache.set(userId, stats)
}

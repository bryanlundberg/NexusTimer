import { getRedis } from '@/shared/config/redis/redis'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'

const PREFIX = 'user:stats:'
const TTL_SECONDS = 60 * 60 * 24 * 30

const key = (userId: string) => `${PREFIX}${userId}`

export interface CachedUserStats {
  version: number
  backupUpdatedAt: number
  summary: UserStatsSummary
}

export const userStatsCache = {
  async get(userId: string): Promise<CachedUserStats | null> {
    try {
      const redis = await getRedis()
      const cached = await redis.get(key(userId))
      return cached ? (JSON.parse(cached) as CachedUserStats) : null
    } catch (error) {
      console.error('userStatsCache.get failed:', error)
      return null
    }
  },

  async set(userId: string, stats: CachedUserStats): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(key(userId), JSON.stringify(stats), { EX: TTL_SECONDS })
    } catch (error) {
      console.error('userStatsCache.set failed:', error)
    }
  },

  async invalidate(userId: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(key(userId))
    } catch (error) {
      console.error('userStatsCache.invalidate failed:', error)
    }
  }
}

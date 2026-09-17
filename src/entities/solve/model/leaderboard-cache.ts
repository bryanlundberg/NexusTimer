import { getRedis } from '@/shared/config/redis/redis'
import type { SolveServer } from '@/entities/solve/model/types'

const PREFIX = 'leaderboard:'

const key = (windowStartedAt: number, variant: string) => `${PREFIX}${windowStartedAt}:${variant}`

export const leaderboardCache = {
  async get(windowStartedAt: number, variant: string): Promise<SolveServer[] | null> {
    try {
      const redis = await getRedis()
      const cached = await redis.get(key(windowStartedAt, variant))
      return cached ? (JSON.parse(cached) as SolveServer[]) : null
    } catch (error) {
      console.error('leaderboardCache.get failed:', error)
      return null
    }
  },

  async set(windowStartedAt: number, variant: string, solves: SolveServer[], ttlSeconds: number): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(key(windowStartedAt, variant), JSON.stringify(solves), { EX: ttlSeconds })
    } catch (error) {
      console.error('leaderboardCache.set failed:', error)
    }
  }
}

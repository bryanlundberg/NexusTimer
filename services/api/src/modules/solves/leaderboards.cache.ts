import type { LeaderboardSolve } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const PREFIX = 'leaderboard:'

export type LeaderboardCache = {
  get(windowStartedAt: number, variant: string): Promise<LeaderboardSolve[] | null>
  set(windowStartedAt: number, variant: string, solves: LeaderboardSolve[], ttlSeconds: number): Promise<void>
}

const key = (windowStartedAt: number, variant: string) => `${PREFIX}${windowStartedAt}:${variant}`

export function createLeaderboardCache(redis: () => Promise<RedisClientType>): LeaderboardCache {
  return {
    async get(windowStartedAt, variant) {
      try {
        const cached = await (await redis()).get(key(windowStartedAt, variant))
        return cached ? (JSON.parse(cached) as LeaderboardSolve[]) : null
      } catch (error) {
        logger.warn('leaderboard cache read failed', { error: serializeError(error) })
        return null
      }
    },
    async set(windowStartedAt, variant, solves, ttlSeconds) {
      try {
        await (await redis()).set(key(windowStartedAt, variant), JSON.stringify(solves), { EX: ttlSeconds })
      } catch (error) {
        logger.warn('leaderboard cache write failed', { error: serializeError(error) })
      }
    }
  }
}

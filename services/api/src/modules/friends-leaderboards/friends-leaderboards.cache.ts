import { USER_STATS_VERSION } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'
import type { CategoryBests, UserBests } from './friends-leaderboards.repository'

const TTL_SECONDS = 60 * 60 * 24

const bestsKey = (userId: string) => `friends-leaderboard:bests:v${USER_STATS_VERSION}:${userId}`

export type BestsCache = {
  getMany(userIds: string[]): Promise<Map<string, CategoryBests[]>>
  setMany(entries: UserBests[]): Promise<void>
  invalidate(userId: string): Promise<void>
}

export function createBestsCache(redis: () => Promise<RedisClientType>): BestsCache {
  const warn = (operation: string, error: unknown) =>
    logger.warn('friends leaderboard cache failed', { operation, error: serializeError(error) })

  return {
    async getMany(userIds) {
      const found = new Map<string, CategoryBests[]>()
      if (userIds.length === 0) return found

      try {
        const values = await (await redis()).mGet(userIds.map(bestsKey))
        values.forEach((raw, index) => {
          const userId = userIds[index]
          if (userId && raw) found.set(userId, JSON.parse(raw) as CategoryBests[])
        })
      } catch (error) {
        warn('getMany', error)
      }
      return found
    },

    async setMany(entries) {
      if (entries.length === 0) return
      try {
        const batch = (await redis()).multi()
        for (const { userId, categories } of entries) {
          batch.set(bestsKey(userId), JSON.stringify(categories), { EX: TTL_SECONDS })
        }
        await batch.exec()
      } catch (error) {
        warn('setMany', error)
      }
    },

    async invalidate(userId) {
      try {
        await (await redis()).del(bestsKey(userId))
      } catch (error) {
        warn('invalidate', error)
      }
    }
  }
}

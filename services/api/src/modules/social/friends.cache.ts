import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const TTL_SECONDS = 60 * 60 * 24 * 7
const SENTINEL = '__init__'

const friendsKey = (userId: string) => `friends:${userId}`

export type FriendsCache = {
  get(userId: string): Promise<string[] | null>
  prime(userId: string, friendIds: string[]): Promise<void>
  invalidate(...userIds: string[]): Promise<void>
}

export function createFriendsCache(redis: () => Promise<RedisClientType>): FriendsCache {
  const warn = (operation: string, error: unknown) =>
    logger.warn('friends cache failed', { operation, error: serializeError(error) })

  return {
    async get(userId) {
      try {
        const members = await (await redis()).sMembers(friendsKey(userId))
        if (!members.includes(SENTINEL)) return null
        return members.filter((member) => member !== SENTINEL)
      } catch (error) {
        warn('get', error)
        return null
      }
    },

    async prime(userId, friendIds) {
      try {
        const key = friendsKey(userId)
        await (
          await redis()
        )
          .multi()
          .del(key)
          .sAdd(key, [SENTINEL, ...friendIds])
          .expire(key, TTL_SECONDS)
          .exec()
      } catch (error) {
        warn('prime', error)
      }
    },

    async invalidate(...userIds) {
      if (userIds.length === 0) return
      try {
        await (await redis()).del(userIds.map(friendsKey))
      } catch (error) {
        warn('invalidate', error)
      }
    }
  }
}

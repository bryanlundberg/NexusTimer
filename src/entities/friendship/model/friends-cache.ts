import { getRedis } from '@/shared/config/redis/redis'

const PREFIX = 'friends:'
const TTL_SECONDS = 60 * 60 * 24 * 7 // 7d

const SENTINEL = '__init__'

const key = (userId: string) => `${PREFIX}${userId}`

export const friendsCache = {
  async get(userId: string): Promise<string[] | null> {
    try {
      const redis = await getRedis()
      const members = await redis.sMembers(key(userId))
      if (!members.includes(SENTINEL)) return null
      return members.filter((m) => m !== SENTINEL)
    } catch (error) {
      console.error('friendsCache.get failed:', error)
      return null
    }
  },

  async prime(userId: string, friendIds: string[]): Promise<void> {
    try {
      const redis = await getRedis()
      const k = key(userId)
      const multi = redis.multi()
      multi.del(k)
      multi.sAdd(k, [SENTINEL, ...friendIds])
      multi.expire(k, TTL_SECONDS)
      await multi.exec()
    } catch (error) {
      console.error('friendsCache.prime failed:', error)
    }
  },

  async invalidate(...userIds: string[]): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(userIds.map(key))
    } catch (error) {
      console.error('friendsCache.invalidate failed:', error)
    }
  }
}

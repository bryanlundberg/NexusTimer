import { getRedis } from '@/shared/config/redis/redis'
import type { UserProfile } from '@/entities/user/model/user'

const PREFIX = 'user:profile:'
const TTL_SECONDS = 60 * 60 * 24 * 30 // 30d

const key = (userId: string) => `${PREFIX}${userId}`

export const userProfileCache = {
  /** Returns the cached public profile, or null on miss / Redis failure. */
  async get(userId: string): Promise<UserProfile | null> {
    try {
      const redis = await getRedis()
      const cached = await redis.get(key(userId))
      return cached ? (JSON.parse(cached) as UserProfile) : null
    } catch (error) {
      console.error('userProfileCache.get failed:', error)
      return null
    }
  },

  /** Primes the cache with the freshly-built public profile. */
  async set(userId: string, profile: UserProfile): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(key(userId), JSON.stringify(profile), { EX: TTL_SECONDS })
    } catch (error) {
      console.error('userProfileCache.set failed:', error)
    }
  },

  /** Best-effort drop; the next GET rebuilds from Mongo. */
  async invalidate(userId: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(key(userId))
    } catch (error) {
      console.error('userProfileCache.invalidate failed:', error)
    }
  }
}

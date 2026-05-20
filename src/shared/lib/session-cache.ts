import { getRedis } from '@/shared/config/redis/redis'

const TTL_SECONDS = 5 * 60
const PREFIX = 'session:'

const key = (sessionId: string) => `${PREFIX}${sessionId}`

export const sessionCache = {
  async get(sessionId: string): Promise<boolean | null> {
    try {
      const redis = await getRedis()
      const value = await redis.get(key(sessionId))
      if (value === null) return null
      return value === '1'
    } catch (error) {
      console.error('sessionCache.get failed:', error)
      return null
    }
  },

  async set(sessionId: string, valid: boolean): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(key(sessionId), valid ? '1' : '0', { EX: TTL_SECONDS })
    } catch (error) {
      console.error('sessionCache.set failed:', error)
    }
  },

  async invalidate(sessionId: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(key(sessionId))
    } catch (error) {
      console.error('sessionCache.invalidate failed:', error)
    }
  }
}

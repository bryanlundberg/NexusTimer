import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const MINUTE_LIMIT = 30
const MINUTE_SECONDS = 60

const minuteKey = (userId: string) => `rate-limit:usernames:${userId}`

export type UsernameLimits = { consume(userId: string): Promise<boolean> }

export function createUsernameLimits(redis: () => Promise<RedisClientType>): UsernameLimits {
  return {
    async consume(userId) {
      try {
        const key = minuteKey(userId)
        const [count] = await (await redis()).multi().incr(key).expire(key, MINUTE_SECONDS, 'NX').exec()
        return Number(count) <= MINUTE_LIMIT
      } catch (error) {
        logger.warn('username limit check failed, allowing it', { error: serializeError(error) })
        return true
      }
    }
  }
}

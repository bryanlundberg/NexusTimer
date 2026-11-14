import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const MINUTE_LIMIT = 20
const MINUTE_SECONDS = 60

const minuteKey = (userId: string) => `rate-limit:solves:${userId}`

export type SolveLimits = { consume(userId: string): Promise<boolean> }

export function createSolveLimits(redis: () => Promise<RedisClientType>): SolveLimits {
  return {
    async consume(userId) {
      try {
        const key = minuteKey(userId)
        const [count] = await (await redis()).multi().incr(key).expire(key, MINUTE_SECONDS, 'NX').exec()
        return Number(count) <= MINUTE_LIMIT
      } catch (error) {
        logger.warn('solve limit check failed, allowing it', { error: serializeError(error) })
        return true
      }
    }
  }
}

import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const HOURLY_LIMIT = 30
const HOUR_SECONDS = 60 * 60

const hourlyKey = (userId: string) => `shared-solves:hourly:${userId}`

export type ShareQuota = { consume(userId: string): Promise<boolean> }

export function createShareQuota(redis: () => Promise<RedisClientType>): ShareQuota {
  return {
    async consume(userId) {
      try {
        const key = hourlyKey(userId)
        const [count] = await (await redis()).multi().incr(key).expire(key, HOUR_SECONDS, 'NX').exec()
        return Number(count) <= HOURLY_LIMIT
      } catch (error) {
        logger.warn('share quota check failed, allowing the share', { error: serializeError(error) })
        return true
      }
    }
  }
}

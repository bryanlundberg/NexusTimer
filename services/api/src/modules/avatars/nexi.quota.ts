import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const HOURLY_LIMIT = 20
const HOUR_SECONDS = 60 * 60

const hourlyKey = (userId: string) => `nexi-avatars:hourly:${userId}`

export type NexiQuota = { consume(userId: string): Promise<boolean> }

export function createNexiQuota(redis: () => Promise<RedisClientType>): NexiQuota {
  return {
    async consume(userId) {
      try {
        const key = hourlyKey(userId)
        const [count] = await (await redis()).multi().incr(key).expire(key, HOUR_SECONDS, 'NX').exec()
        return Number(count) <= HOURLY_LIMIT
      } catch (error) {
        logger.warn('nexi quota check failed, allowing the save', { error: serializeError(error) })
        return true
      }
    }
  }
}

import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const HOURLY_LIMIT = 5
const HOUR_SECONDS = 60 * 60

const hourlyKey = (ip: string) => `rate-limit:algorithm-suggestions:${ip}`

export type SuggestionLimits = { consume(ip: string): Promise<boolean> }

export function createSuggestionLimits(redis: () => Promise<RedisClientType>): SuggestionLimits {
  return {
    async consume(ip) {
      try {
        const key = hourlyKey(ip)
        const [count] = await (await redis()).multi().incr(key).expire(key, HOUR_SECONDS, 'NX').exec()
        return Number(count) <= HOURLY_LIMIT
      } catch (error) {
        logger.warn('suggestion limit check failed, allowing it', { error: serializeError(error) })
        return true
      }
    }
  }
}

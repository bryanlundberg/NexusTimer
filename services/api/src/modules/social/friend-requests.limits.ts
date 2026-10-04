import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const DAILY_LIMIT = 30
const DAY_SECONDS = 60 * 60 * 24
const RESEND_COOLDOWN_SECONDS = DAY_SECONDS

const dailyKey = (userId: string) => `friend-requests:daily:${userId}`
const cooldownKey = (userId: string, otherId: string) => `friend-requests:cooldown:${userId}:${otherId}`

export type FriendRequestLimits = {
  onCooldown(userId: string, otherId: string): Promise<boolean>
  startCooldown(userId: string, otherId: string): Promise<void>
  consumeDaily(userId: string): Promise<boolean>
}

export function createFriendRequestLimits(redis: () => Promise<RedisClientType>): FriendRequestLimits {
  const warn = (operation: string, error: unknown) =>
    logger.warn('friend request limits failed', { operation, error: serializeError(error) })

  return {
    async onCooldown(userId, otherId) {
      try {
        return (await (await redis()).exists(cooldownKey(userId, otherId))) > 0
      } catch (error) {
        warn('onCooldown', error)
        return false
      }
    },

    async startCooldown(userId, otherId) {
      try {
        await (await redis()).set(cooldownKey(userId, otherId), '1', { EX: RESEND_COOLDOWN_SECONDS })
      } catch (error) {
        warn('startCooldown', error)
      }
    },

    async consumeDaily(userId) {
      try {
        const key = dailyKey(userId)
        const [count] = await (await redis()).multi().incr(key).expire(key, DAY_SECONDS, 'NX').exec()
        return Number(count) <= DAILY_LIMIT
      } catch (error) {
        warn('consumeDaily', error)
        return true
      }
    }
  }
}

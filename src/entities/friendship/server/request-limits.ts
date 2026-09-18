import { getRedis } from '@/shared/config/redis/redis'

const DAILY_LIMIT = 30
const DAY_SECONDS = 60 * 60 * 24
const RESEND_COOLDOWN_SECONDS = DAY_SECONDS

const dailyKey = (userId: string) => `friend-requests:daily:${userId}`
const cooldownKey = (userId: string, otherId: string) => `friend-requests:cooldown:${userId}:${otherId}`

export const requestLimits = {
  async onCooldown(userId: string, otherId: string): Promise<boolean> {
    try {
      const redis = await getRedis()
      return (await redis.exists(cooldownKey(userId, otherId))) > 0
    } catch (error) {
      console.error('requestLimits.onCooldown failed:', error)
      return false
    }
  },

  async startCooldown(userId: string, otherId: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(cooldownKey(userId, otherId), '1', { EX: RESEND_COOLDOWN_SECONDS })
    } catch (error) {
      console.error('requestLimits.startCooldown failed:', error)
    }
  },

  async consumeDaily(userId: string): Promise<boolean> {
    try {
      const redis = await getRedis()
      const key = dailyKey(userId)
      const [count] = (await redis.multi().incr(key).expire(key, DAY_SECONDS, 'NX').exec()) as unknown[]
      return Number(count) <= DAILY_LIMIT
    } catch (error) {
      console.error('requestLimits.consumeDaily failed:', error)
      return true
    }
  }
}

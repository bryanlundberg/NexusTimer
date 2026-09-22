import { getRedis } from '@/shared/config/redis/redis'

const HOURLY_LIMIT = 30
const HOUR_SECONDS = 60 * 60

const hourlyKey = (userId: string) => `shared-solves:hourly:${userId}`

export async function consumeShareQuota(userId: string): Promise<boolean> {
  try {
    const redis = await getRedis()
    const key = hourlyKey(userId)
    const [count] = (await redis.multi().incr(key).expire(key, HOUR_SECONDS, 'NX').exec()) as unknown[]
    return Number(count) <= HOURLY_LIMIT
  } catch (error) {
    console.error('consumeShareQuota failed:', error)
    return true
  }
}

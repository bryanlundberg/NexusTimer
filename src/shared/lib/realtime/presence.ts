import { getRedis } from '@/shared/config/redis/redis'

/** Mirrored from services/realtime/internal/broker/presence.go. */
const CONNS_PREFIX = 'rt:conns:'
const STATUS_PREFIX = 'rt:status:'
const LAST_SEEN_PREFIX = 'rt:lastseen:'

export async function clearPresence(userId: string): Promise<void> {
  try {
    const redis = await getRedis()
    await redis.del([CONNS_PREFIX + userId, STATUS_PREFIX + userId, LAST_SEEN_PREFIX + userId])
  } catch (error) {
    console.error('clearPresence failed:', error)
  }
}

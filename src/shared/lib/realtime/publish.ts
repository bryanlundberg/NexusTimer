import { getRedis } from '@/shared/config/redis/redis'
import { userChannel, type RealtimeEvent } from '@/shared/lib/realtime/events'

/** Best-effort: data is already saved, so a failure only delays the update until the client refetches. */
export async function publishToUser(userId: string, event: RealtimeEvent): Promise<void> {
  try {
    const redis = await getRedis()
    await redis.publish(userChannel(userId), JSON.stringify(event))
  } catch (error) {
    console.error('publishToUser failed:', error)
  }
}

type PairEventType = Extract<RealtimeEvent, { type: `friend:${string}` }>['type']

export async function publishToPair(userId: string, otherId: string, type: PairEventType): Promise<void> {
  await Promise.all([publishToUser(userId, { type, userId: otherId }), publishToUser(otherId, { type, userId })])
}

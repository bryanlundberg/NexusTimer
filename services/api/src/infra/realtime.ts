import {
  type FriendEventType,
  presenceChannel,
  type PresenceUser,
  type RealtimeEvent,
  userChannel
} from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../lib/logger'

export type RealtimePublisher = {
  toUser(userId: string, event: RealtimeEvent): Promise<void>
  toPair(userId: string, otherId: string, type: FriendEventType): Promise<void>
  presence(user: PresenceUser): Promise<void>
}

export function createRealtimePublisher(redis: () => Promise<RedisClientType>): RealtimePublisher {
  async function publish(channel: string, event: RealtimeEvent) {
    try {
      await (await redis()).publish(channel, JSON.stringify(event))
    } catch (error) {
      logger.warn('realtime publish failed', { channel, error: serializeError(error) })
    }
  }

  const toUser = (userId: string, event: RealtimeEvent) => publish(userChannel(userId), event)

  return {
    toUser,
    async toPair(userId, otherId, type) {
      await Promise.all([toUser(userId, { type, userId: otherId }), toUser(otherId, { type, userId })])
    },
    presence: (user) => publish(presenceChannel(user.userId), { type: 'presence', users: [user] })
  }
}

import type { PublicUser } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'
import { toPublicUser } from './public-user'

const profileKey = (userId: string) => `user:profile:${userId}`

export type ProfileCache = {
  getMany(ids: string[]): Promise<Map<string, PublicUser>>
}

export function createProfileCache(redis: () => Promise<RedisClientType>): ProfileCache {
  return {
    async getMany(ids) {
      const found = new Map<string, PublicUser>()
      if (ids.length === 0) return found

      try {
        const values = await (await redis()).mGet(ids.map(profileKey))
        values.forEach((raw, index) => {
          const id = ids[index]
          if (raw && id) found.set(id, toPublicUser(id, JSON.parse(raw)))
        })
      } catch (error) {
        logger.warn('profile cache read failed', { error: serializeError(error) })
      }
      return found
    }
  }
}

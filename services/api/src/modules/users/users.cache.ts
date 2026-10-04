import type { PublicUser, UserProfileResponse } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'
import { toPublicUser } from './public-user'
import type { StatsSnapshot } from './users.repository'

type RedisProvider = () => Promise<RedisClientType>

const PROFILE_TTL_SECONDS = 60 * 60 * 24 * 30
const STATS_TTL_SECONDS = 60 * 60 * 24 * 30

const profileKey = (userId: string) => `user:profile:${userId}`
const statsKey = (userId: string) => `user:stats:${userId}`

const warn = (operation: string, error: unknown) =>
  logger.warn('users cache failed', { operation, error: serializeError(error) })

export type ProfileCache = {
  get(userId: string): Promise<UserProfileResponse | null>
  set(userId: string, profile: UserProfileResponse): Promise<void>
  invalidate(userId: string): Promise<void>
  getMany(ids: string[]): Promise<Map<string, PublicUser>>
}

export type StatsCache = {
  get(userId: string): Promise<StatsSnapshot | null>
  set(userId: string, stats: StatsSnapshot): Promise<void>
}

async function readJson<T>(redis: RedisProvider, key: string, operation: string): Promise<T | null> {
  try {
    const raw = await (await redis()).get(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (error) {
    warn(operation, error)
    return null
  }
}

async function writeJson(redis: RedisProvider, key: string, value: unknown, ttlSeconds: number, operation: string) {
  try {
    await (await redis()).set(key, JSON.stringify(value), { EX: ttlSeconds })
  } catch (error) {
    warn(operation, error)
  }
}

export function createProfileCache(redis: RedisProvider): ProfileCache {
  return {
    get: (userId) => readJson<UserProfileResponse>(redis, profileKey(userId), 'profile.get'),

    set: (userId, profile) => writeJson(redis, profileKey(userId), profile, PROFILE_TTL_SECONDS, 'profile.set'),

    async invalidate(userId) {
      try {
        await (await redis()).del(profileKey(userId))
      } catch (error) {
        warn('profile.invalidate', error)
      }
    },

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
        warn('profile.getMany', error)
      }
      return found
    }
  }
}

export function createStatsCache(redis: RedisProvider): StatsCache {
  return {
    get: (userId) => readJson<StatsSnapshot>(redis, statsKey(userId), 'stats.get'),
    set: (userId, stats) => writeJson(redis, statsKey(userId), stats, STATS_TTL_SECONDS, 'stats.set')
  }
}

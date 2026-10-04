import type { MySharedIds } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'
import type { StoredSharedSolve } from './shared-solves.repository'

const SLUG_TTL_SECONDS = 60 * 60 * 24 * 30
const MISSING_TTL_SECONDS = 60 * 5
const USER_TTL_SECONDS = 60 * 60 * 24 * 7
const MISSING = '__missing__'

const slugKey = (slug: string) => `shared-solve:slug:${slug}`
const listKey = (userId: string) => `shared-solve:list:${userId}`
const idsKey = (userId: string) => `shared-solve:ids:${userId}`

export type SharedSolvesCache = {
  getBySlug(slug: string): Promise<StoredSharedSolve | 'missing' | null>
  primeSlug(slug: string, value: StoredSharedSolve | null): Promise<void>
  getIds(userId: string): Promise<MySharedIds | null>
  primeIds(userId: string, ids: MySharedIds): Promise<void>
  invalidate(userId: string, slugs: string[]): Promise<void>
}

export function createSharedSolvesCache(redis: () => Promise<RedisClientType>): SharedSolvesCache {
  const warn = (operation: string, error: unknown) =>
    logger.warn('shared solve cache failed', { operation, error: serializeError(error) })

  async function read<T>(key: string, operation: string): Promise<T | typeof MISSING | null> {
    try {
      const raw = await (await redis()).get(key)
      if (raw == null) return null
      return raw === MISSING ? MISSING : (JSON.parse(raw) as T)
    } catch (error) {
      warn(operation, error)
      return null
    }
  }

  async function write(key: string, value: string, ttlSeconds: number, operation: string) {
    try {
      await (await redis()).set(key, value, { EX: ttlSeconds })
    } catch (error) {
      warn(operation, error)
    }
  }

  return {
    async getBySlug(slug) {
      const cached = await read<StoredSharedSolve>(slugKey(slug), 'getBySlug')
      return cached === MISSING ? 'missing' : cached
    },

    async primeSlug(slug, value) {
      if (value) await write(slugKey(slug), JSON.stringify(value), SLUG_TTL_SECONDS, 'primeSlug')
      else await write(slugKey(slug), MISSING, MISSING_TTL_SECONDS, 'primeSlug')
    },

    async getIds(userId) {
      const cached = await read<MySharedIds>(idsKey(userId), 'getIds')
      return cached === MISSING ? null : cached
    },

    async primeIds(userId, ids) {
      await write(idsKey(userId), JSON.stringify(ids), USER_TTL_SECONDS, 'primeIds')
    },

    async invalidate(userId, slugs) {
      try {
        await (await redis()).del([listKey(userId), idsKey(userId), ...slugs.map(slugKey)])
      } catch (error) {
        warn('invalidate', error)
      }
    }
  }
}

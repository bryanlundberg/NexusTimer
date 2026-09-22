import { getRedis } from '@/shared/config/redis/redis'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { MySharedIds, SharedSolveItem, SharedSolvesPage } from '@/entities/shared-solve/model/types'

const SLUG_TTL_SECONDS = 60 * 60 * 24 * 30 // 30d
const MISSING_TTL_SECONDS = 60 * 5 // 5m
const USER_TTL_SECONDS = 60 * 60 * 24 * 7 // 7d

const MISSING = '__missing__'

const slugKey = (slug: string) => `shared-solve:slug:${slug}`
const listKey = (userId: string) => `shared-solve:list:${userId}`
const idsKey = (userId: string) => `shared-solve:ids:${userId}`

export interface CachedSharedSolve {
  ownerId: string
  item: SharedSolveItem
  replay?: SolveReplay
}

async function readJson<T>(key: string, scope: string): Promise<T | typeof MISSING | null> {
  try {
    const redis = await getRedis()
    const raw = await redis.get(key)
    if (raw == null) return null
    return raw === MISSING ? MISSING : (JSON.parse(raw) as T)
  } catch (error) {
    console.error(`sharedSolveCache.${scope} failed:`, error)
    return null
  }
}

async function writeJson(key: string, value: unknown, ttl: number, scope: string): Promise<void> {
  try {
    const redis = await getRedis()
    await redis.set(key, typeof value === 'string' ? value : JSON.stringify(value), { EX: ttl })
  } catch (error) {
    console.error(`sharedSolveCache.${scope} failed:`, error)
  }
}

async function drop(keys: string[], scope: string): Promise<void> {
  if (keys.length === 0) return
  try {
    const redis = await getRedis()
    await redis.del(keys)
  } catch (error) {
    console.error(`sharedSolveCache.${scope} failed:`, error)
  }
}

export const sharedSolveCache = {
  async getBySlug(slug: string): Promise<CachedSharedSolve | 'missing' | null> {
    const cached = await readJson<CachedSharedSolve>(slugKey(slug), 'getBySlug')
    return cached === MISSING ? 'missing' : cached
  },

  async primeSlug(slug: string, value: CachedSharedSolve | null): Promise<void> {
    if (value) await writeJson(slugKey(slug), value, SLUG_TTL_SECONDS, 'primeSlug')
    else await writeJson(slugKey(slug), MISSING, MISSING_TTL_SECONDS, 'primeSlug')
  },

  async getFirstPage(userId: string): Promise<SharedSolvesPage | null> {
    const cached = await readJson<SharedSolvesPage>(listKey(userId), 'getFirstPage')
    return cached === MISSING ? null : cached
  },

  async primeFirstPage(userId: string, page: SharedSolvesPage): Promise<void> {
    await writeJson(listKey(userId), page, USER_TTL_SECONDS, 'primeFirstPage')
  },

  async getIds(userId: string): Promise<MySharedIds | null> {
    const cached = await readJson<MySharedIds>(idsKey(userId), 'getIds')
    return cached === MISSING ? null : cached
  },

  async primeIds(userId: string, ids: MySharedIds): Promise<void> {
    await writeJson(idsKey(userId), ids, USER_TTL_SECONDS, 'primeIds')
  },

  async invalidate(userId: string, slugs: string[] = []): Promise<void> {
    await drop([listKey(userId), idsKey(userId), ...slugs.map(slugKey)], 'invalidate')
  }
}

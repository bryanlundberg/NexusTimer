import { getRedis } from '@/shared/config/redis/redis'

// First page of the solve history per (user, method), newest first, as a
// Redis LIST of JSON items. Kept hot via write-through LPUSH on each solve;
// destructive mutations (delete / penalty edit) just drop the key.
//
// Keep in sync with TRAINER_PAGE_SIZE (features/trainer/lib/constants).
export const SOLVES_FIRST_PAGE_SIZE = 25

const PREFIX = 'trainer:solves:'

// Tail marker meaning "this list holds the user's COMPLETE history".
// When LTRIM drops it, the list only holds the newest SOLVES_FIRST_PAGE_SIZE+.
const SENTINEL = '__end__'

const key = (userId: string, methodSlug: string) => `${PREFIX}${userId}:${methodSlug}`

export const solvesCache = {
  /**
   * Returns the newest `limit` solves, or null on miss / Redis failure /
   * a limit the cached window cannot answer.
   */
  async getFirstPage(userId: string, methodSlug: string, limit: number): Promise<unknown[] | null> {
    if (limit > SOLVES_FIRST_PAGE_SIZE) return null
    try {
      const redis = await getRedis()
      const items = await redis.lRange(key(userId, methodSlug), 0, -1)
      if (items.length === 0) return null

      const complete = items[items.length - 1] === SENTINEL
      const solves = complete ? items.slice(0, -1) : items

      // Incomplete window shorter than requested — cannot answer safely.
      if (!complete && solves.length < limit) return null

      return solves.slice(0, limit).map((s) => JSON.parse(s))
    } catch (error) {
      console.error('solvesCache.getFirstPage failed:', error)
      return null
    }
  },

  /**
   * Replaces the list with the newest-first solves loaded from Mongo.
   * `complete` marks that `solves` is the user's entire history.
   */
  async prime(userId: string, methodSlug: string, solves: unknown[], complete: boolean): Promise<void> {
    try {
      const redis = await getRedis()
      const k = key(userId, methodSlug)
      const items = solves.map((s) => JSON.stringify(s))
      if (complete) items.push(SENTINEL)
      if (items.length === 0) return

      const multi = redis.multi()
      multi.del(k)
      multi.rPush(k, items)
      await multi.exec()
    } catch (error) {
      console.error('solvesCache.prime failed:', error)
    }
  },

  /** Write-through: prepends a new solve. Only touches an already-cached list. */
  async push(userId: string, methodSlug: string, solve: unknown): Promise<void> {
    const k = key(userId, methodSlug)
    try {
      const redis = await getRedis()
      const exists = await redis.exists(k)
      if (!exists) return

      const multi = redis.multi()
      multi.lPush(k, JSON.stringify(solve))
      // Keep the sentinel while the history is short; once the window is
      // full the sentinel falls off and the list becomes a partial window.
      multi.lTrim(k, 0, SOLVES_FIRST_PAGE_SIZE)
      await multi.exec()
    } catch (error) {
      console.error('solvesCache.push failed:', error)
      await this.invalidate(userId, methodSlug)
    }
  },

  /** Best-effort delete; the next GET will rebuild from Mongo. */
  async invalidate(userId: string, methodSlug: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(key(userId, methodSlug))
    } catch (error) {
      console.error('solvesCache.invalidate failed:', error)
    }
  }
}

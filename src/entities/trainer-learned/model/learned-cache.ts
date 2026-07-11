import { getRedis } from '@/shared/config/redis/redis'

const PREFIX = 'trainer:learned:'

// Distinguishes "cached and empty" from "not cached".
const SENTINEL = '__init__'

const key = (userId: string, methodSlug: string) => `${PREFIX}${userId}:${methodSlug}`
const summaryKey = (userId: string) => `trainer:learned-summary:${userId}`

export interface LearnedMethodSummary {
  methodSlug: string
  count: number
  caseIds: string[]
}

export interface LearnedSummary {
  total: number
  methods: LearnedMethodSummary[]
}

export const learnedCache = {
  /** Returns the cached caseIds, or null on miss / Redis failure. */
  async get(userId: string, methodSlug: string): Promise<string[] | null> {
    try {
      const redis = await getRedis()
      const members = await redis.sMembers(key(userId, methodSlug))
      if (!members.includes(SENTINEL)) return null
      return members.filter((m) => m !== SENTINEL)
    } catch (error) {
      console.error('learnedCache.get failed:', error)
      return null
    }
  },

  /** Replaces the cached set with the full list loaded from Mongo. */
  async prime(userId: string, methodSlug: string, caseIds: string[]): Promise<void> {
    try {
      const redis = await getRedis()
      const k = key(userId, methodSlug)
      const multi = redis.multi()
      multi.del(k)
      multi.sAdd(k, [SENTINEL, ...caseIds])
      await multi.exec()
    } catch (error) {
      console.error('learnedCache.prime failed:', error)
    }
  },

  /** Write-through update. Only touches the set if it is already cached. */
  async setLearned(userId: string, methodSlug: string, caseId: string, learned: boolean): Promise<void> {
    const k = key(userId, methodSlug)
    try {
      const redis = await getRedis()
      const cached = await redis.sIsMember(k, SENTINEL)
      if (!cached) return
      if (learned) {
        await redis.sAdd(k, caseId)
      } else {
        await redis.sRem(k, caseId)
      }
    } catch (error) {
      console.error('learnedCache.setLearned failed:', error)
      await this.invalidate(userId, methodSlug)
    }
  },

  /** Best-effort delete; the next GET will rebuild from Mongo. */
  async invalidate(userId: string, methodSlug: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(key(userId, methodSlug))
    } catch (error) {
      console.error('learnedCache.invalidate failed:', error)
    }
  },

  /** Cached profile aggregate (all methods), or null on miss / Redis failure. */
  async getSummary(userId: string): Promise<LearnedSummary | null> {
    try {
      const redis = await getRedis()
      const raw = await redis.get(summaryKey(userId))
      return raw ? (JSON.parse(raw) as LearnedSummary) : null
    } catch (error) {
      console.error('learnedCache.getSummary failed:', error)
      return null
    }
  },

  async primeSummary(userId: string, summary: LearnedSummary): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.set(summaryKey(userId), JSON.stringify(summary))
    } catch (error) {
      console.error('learnedCache.primeSummary failed:', error)
    }
  },

  /** Called on every learned mutation so the profile never serves stale totals. */
  async invalidateSummary(userId: string): Promise<void> {
    try {
      const redis = await getRedis()
      await redis.del(summaryKey(userId))
    } catch (error) {
      console.error('learnedCache.invalidateSummary failed:', error)
    }
  }
}

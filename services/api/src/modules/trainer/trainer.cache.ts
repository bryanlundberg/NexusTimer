import { TRAINER_PAGE_SIZE, type TrainerSolveItem } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

type RedisProvider = () => Promise<RedisClientType>

const TTL_SECONDS = 60 * 60 * 24 * 7
const LEARNED_SENTINEL = '__init__'
const SOLVES_SENTINEL = '__end__'

const learnedKey = (userId: string, methodSlug: string) => `trainer:learned:${userId}:${methodSlug}`
const learnedSummaryKey = (userId: string) => `trainer:learned-summary:${userId}`
const solvesKey = (userId: string, methodSlug: string) => `trainer:solves:${userId}:${methodSlug}`

const warn = (operation: string, error: unknown) =>
  logger.warn('trainer cache failed', { operation, error: serializeError(error) })

export type LearnedCache = {
  get(userId: string, methodSlug: string): Promise<string[] | null>
  prime(userId: string, methodSlug: string, caseIds: string[]): Promise<void>
  setLearned(userId: string, methodSlug: string, caseId: string, learned: boolean): Promise<void>
  invalidateSummary(userId: string): Promise<void>
}

export type SolvesCache = {
  getFirstPage(userId: string, methodSlug: string, limit: number): Promise<TrainerSolveItem[] | null>
  prime(userId: string, methodSlug: string, solves: TrainerSolveItem[], complete: boolean): Promise<void>
  push(userId: string, methodSlug: string, solve: TrainerSolveItem): Promise<void>
  invalidate(userId: string, methodSlug: string): Promise<void>
}

export function createLearnedCache(redis: RedisProvider): LearnedCache {
  async function invalidate(userId: string, methodSlug: string) {
    try {
      await (await redis()).del(learnedKey(userId, methodSlug))
    } catch (error) {
      warn('learned.invalidate', error)
    }
  }

  return {
    async get(userId, methodSlug) {
      try {
        const members = await (await redis()).sMembers(learnedKey(userId, methodSlug))
        if (!members.includes(LEARNED_SENTINEL)) return null
        return members.filter((member) => member !== LEARNED_SENTINEL)
      } catch (error) {
        warn('learned.get', error)
        return null
      }
    },

    async prime(userId, methodSlug, caseIds) {
      try {
        const key = learnedKey(userId, methodSlug)
        await (
          await redis()
        )
          .multi()
          .del(key)
          .sAdd(key, [LEARNED_SENTINEL, ...caseIds])
          .expire(key, TTL_SECONDS)
          .exec()
      } catch (error) {
        warn('learned.prime', error)
      }
    },

    async setLearned(userId, methodSlug, caseId, learned) {
      const key = learnedKey(userId, methodSlug)
      try {
        const client = await redis()
        if (!(await client.sIsMember(key, LEARNED_SENTINEL))) return
        if (learned) {
          await client.sAdd(key, caseId)
          await client.expire(key, TTL_SECONDS, 'NX')
        } else {
          await client.sRem(key, caseId)
        }
      } catch (error) {
        warn('learned.setLearned', error)
        await invalidate(userId, methodSlug)
      }
    },

    async invalidateSummary(userId) {
      try {
        await (await redis()).del(learnedSummaryKey(userId))
      } catch (error) {
        warn('learned.invalidateSummary', error)
      }
    }
  }
}

export function createSolvesCache(redis: RedisProvider): SolvesCache {
  async function invalidate(userId: string, methodSlug: string) {
    try {
      await (await redis()).del(solvesKey(userId, methodSlug))
    } catch (error) {
      warn('solves.invalidate', error)
    }
  }

  return {
    async getFirstPage(userId, methodSlug, limit) {
      if (limit > TRAINER_PAGE_SIZE) return null
      try {
        const items = await (await redis()).lRange(solvesKey(userId, methodSlug), 0, -1)
        if (items.length === 0) return null

        const complete = items[items.length - 1] === SOLVES_SENTINEL
        const solves = complete ? items.slice(0, -1) : items
        if (!complete && solves.length < limit) return null

        return solves.slice(0, limit).map((item) => JSON.parse(item) as TrainerSolveItem)
      } catch (error) {
        warn('solves.getFirstPage', error)
        return null
      }
    },

    async prime(userId, methodSlug, solves, complete) {
      const items = solves.map((solve) => JSON.stringify(solve))
      if (complete) items.push(SOLVES_SENTINEL)
      if (items.length === 0) return

      try {
        const key = solvesKey(userId, methodSlug)
        await (await redis()).multi().del(key).rPush(key, items).expire(key, TTL_SECONDS).exec()
      } catch (error) {
        warn('solves.prime', error)
      }
    },

    async push(userId, methodSlug, solve) {
      const key = solvesKey(userId, methodSlug)
      try {
        const client = await redis()
        if (!(await client.exists(key))) return
        await client
          .multi()
          .lPush(key, JSON.stringify(solve))
          .lTrim(key, 0, TRAINER_PAGE_SIZE)
          .expire(key, TTL_SECONDS, 'NX')
          .exec()
      } catch (error) {
        warn('solves.push', error)
        await invalidate(userId, methodSlug)
      }
    },

    invalidate
  }
}

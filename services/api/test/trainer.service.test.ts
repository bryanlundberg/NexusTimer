import { TRAINER_PAGE_SIZE, type TrainerCaseStatsDoc, type TrainerSolveItem } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { createLearnedCache, createSolvesCache } from '../src/modules/trainer/trainer.cache'
import type { MethodTotals, TrainerRepository } from '../src/modules/trainer/trainer.repository'
import { caseStatsFrom, createTrainerService } from '../src/modules/trainer/trainer.service'
import { fakeRedis } from './fake-redis'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const BASE_TIME = Date.parse('2026-10-04T10:00:00.000Z')

type StoredSolve = TrainerSolveItem & { createdAtMs: number }

function fakeRepository() {
  const learned = new Set<string>()
  const solves: StoredSolve[] = []
  const caseStats = new Map<string, TrainerCaseStatsDoc | null>()
  const methodTotals = new Map<string, MethodTotals>()
  const recorded: { methodSlug: string; caseId: string; timeMs: number; atMs: number }[] = []
  const calls = { learnedCaseIds: 0, listSolves: [] as number[] }
  let nextId = 1

  const owned = (methodSlug: string) => solves.filter((s) => s.user === USER && s.methodSlug === methodSlug)

  const repository: TrainerRepository = {
    async learnedCaseIds(userId, methodSlug) {
      calls.learnedCaseIds++
      return [...learned].filter((key) => key.startsWith(`${userId}|${methodSlug}|`)).map((key) => key.split('|')[2]!)
    },
    async learnedByMethod(userId) {
      const byMethod = new Map<string, string[]>()
      for (const key of learned) {
        const [owner, methodSlug, caseId] = key.split('|')
        if (owner === userId) byMethod.set(methodSlug!, [...(byMethod.get(methodSlug!) ?? []), caseId!])
      }
      return [...byMethod].map(([methodSlug, caseIds]) => ({ methodSlug, count: caseIds.length, caseIds }))
    },
    async markLearned(userId, methodSlug, caseId) {
      learned.add(`${userId}|${methodSlug}|${caseId}`)
    },
    async unmarkLearned(userId, methodSlug, caseId) {
      learned.delete(`${userId}|${methodSlug}|${caseId}`)
    },
    async listSolves({ methodSlug, caseId, before }, limit) {
      calls.listSolves.push(limit)
      return owned(methodSlug)
        .filter((s) => (!caseId || s.caseId === caseId) && (!before || s._id < before))
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, limit)
        .map(({ createdAtMs: _, ...item }) => item)
    },
    async createSolve({ userId, methodSlug, caseId, timeMs }) {
      const createdAtMs = BASE_TIME + nextId * 1000
      const at = new Date(createdAtMs).toISOString()
      const solve = {
        _id: String(nextId++).padStart(24, '0'),
        user: userId,
        methodSlug,
        caseId,
        timeMs,
        createdAt: at,
        updatedAt: at,
        createdAtMs
      }
      solves.push(solve)
      return solve
    },
    async deleteSolve(userId, solveId) {
      const index = solves.findIndex((s) => s._id === solveId && s.user === userId)
      if (index === -1) return null
      const [removed] = solves.splice(index, 1)
      return { methodSlug: removed!.methodSlug, caseId: removed!.caseId }
    },
    async caseSolvesOldestFirst(_userId, methodSlug, caseId) {
      return owned(methodSlug)
        .filter((s) => s.caseId === caseId)
        .map(({ timeMs, createdAtMs }) => ({ timeMs, createdAtMs }))
    },
    async methodTotals(_userId, methodSlug) {
      const times = owned(methodSlug).map((s) => s.timeMs)
      return {
        totalSolves: times.length,
        totalTimeMs: times.reduce((sum, t) => sum + t, 0),
        bestSingleMs: times.length ? Math.min(...times) : null
      }
    },
    async recordSolveStats(_userId, solve) {
      recorded.push(solve)
    },
    async setCaseStats(_userId, methodSlug, caseId, stats) {
      caseStats.set(`${methodSlug}|${caseId}`, stats)
    },
    async setMethodTotals(_userId, methodSlug, totals) {
      methodTotals.set(methodSlug, totals)
    },
    async findStats() {
      return {}
    },
    async setTarget() {}
  }

  return { repository, learned, solves, caseStats, methodTotals, recorded, calls }
}

function setup() {
  const redis = fakeRedis()
  const repo = fakeRepository()
  const service = createTrainerService({
    repository: repo.repository,
    learnedCache: createLearnedCache(redis.provider),
    solvesCache: createSolvesCache(redis.provider)
  })
  return { service, repo, redis }
}

describe('caseStatsFrom', () => {
  it('returns null without solves', () => {
    expect(caseStatsFrom([])).toBeNull()
  })

  it('summarizes the case and keeps the last twelve times', () => {
    const solves = Array.from({ length: 14 }, (_, i) => ({ timeMs: 1000 + i, createdAtMs: i }))

    expect(caseStatsFrom(solves)).toEqual({
      totalSolves: 14,
      totalTimeMs: solves.reduce((sum, s) => sum + s.timeMs, 0),
      bestSingleMs: 1000,
      lastSolveMs: 1013,
      lastSolveAt: 13,
      recentTimes: solves.slice(-12).map((s) => s.timeMs)
    })
  })
})

describe('trainer service', () => {
  it('reads learned cases once and serves them from the cache afterwards', async () => {
    const { service, repo } = setup()
    repo.learned.add(`${USER}|pll|aa`)

    expect(await service.learned(USER, 'pll')).toEqual(['aa'])
    expect(await service.learned(USER, 'pll')).toEqual(['aa'])
    expect(repo.calls.learnedCaseIds).toBe(1)
  })

  it('writes learned changes through the cache and drops the profile summary', async () => {
    const { service, redis } = setup()
    await service.learned(USER, 'pll')
    redis.strings.set(`trainer:learned-summary:${USER}`, '{}')

    await service.setLearned(USER, { methodSlug: 'pll', caseId: 'aa', learned: true })

    expect(await service.learned(USER, 'pll')).toEqual(['aa'])
    expect(redis.strings.size).toBe(0)
  })

  it('reads a full window for the first page, caches it and serves the next request from Redis', async () => {
    const { service, repo } = setup()
    await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 900 })
    await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'ab', timeMs: 800 })

    const first = await service.solves(USER, { methodSlug: 'pll', limit: 1 })
    const again = await service.solves(USER, { methodSlug: 'pll', limit: 2 })

    expect(first.map((s) => s.caseId)).toEqual(['ab'])
    expect(again.map((s) => s.caseId)).toEqual(['ab', 'aa'])
    expect(repo.calls.listSolves).toEqual([TRAINER_PAGE_SIZE])
  })

  it('goes to the database for filtered or later pages', async () => {
    const { service, repo } = setup()
    const older = await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 900 })
    const newer = await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 800 })

    expect(await service.solves(USER, { methodSlug: 'pll', limit: 12, before: newer._id })).toEqual([older])
    expect(await service.solves(USER, { methodSlug: 'pll', caseId: 'aa', limit: 1 })).toEqual([newer])
    expect(repo.calls.listSolves).toEqual([12, 1])
  })

  it('records the solve in the stats with its creation time and pushes it to a cached first page', async () => {
    const { service, repo } = setup()
    await service.solves(USER, { methodSlug: 'pll', limit: 12 })

    const solve = await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 750 })

    expect(solve).not.toHaveProperty('createdAtMs')
    expect(repo.recorded).toEqual([{ methodSlug: 'pll', caseId: 'aa', timeMs: 750, atMs: Date.parse(solve.createdAt) }])
    expect(await service.solves(USER, { methodSlug: 'pll', limit: 12 })).toEqual([solve])
  })

  it('recomputes the case and method after a delete and drops the cached page', async () => {
    const { service, repo, redis } = setup()
    const first = await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 900 })
    const second = await service.recordSolve(USER, { methodSlug: 'pll', caseId: 'aa', timeMs: 700 })
    await service.solves(USER, { methodSlug: 'pll', limit: 12 })

    expect(await service.deleteSolve(USER, second._id)).toBe(true)
    expect(repo.caseStats.get('pll|aa')).toMatchObject({ totalSolves: 1, bestSingleMs: 900, recentTimes: [900] })
    expect(repo.methodTotals.get('pll')).toEqual({ totalSolves: 1, totalTimeMs: 900, bestSingleMs: 900 })
    expect(redis.lists.size).toBe(0)

    await service.deleteSolve(USER, first._id)
    expect(repo.caseStats.get('pll|aa')).toBeNull()
    expect(repo.methodTotals.get('pll')).toEqual({ totalSolves: 0, totalTimeMs: 0, bestSingleMs: null })
  })

  it('reports a missing solve without touching the stats', async () => {
    const { service, repo } = setup()

    expect(await service.deleteSolve(USER, 'f'.repeat(24))).toBe(false)
    expect(repo.caseStats.size).toBe(0)
  })
})

describe('learned summary', () => {
  it('groups learned cases per method once and serves the cached summary afterwards', async () => {
    const { service, repo, redis } = setup()
    repo.learned.add(`${USER}|pll|aa`)
    repo.learned.add(`${USER}|pll|ab`)
    repo.learned.add(`${USER}|oll|o1`)

    const summary = await service.learnedSummary(USER)
    repo.learned.add(`${USER}|oll|o2`)

    expect(summary.total).toBe(3)
    expect(summary.methods).toEqual(
      expect.arrayContaining([
        { methodSlug: 'pll', count: 2, caseIds: ['aa', 'ab'] },
        { methodSlug: 'oll', count: 1, caseIds: ['o1'] }
      ])
    )
    expect(await service.learnedSummary(USER)).toEqual(summary)
    expect(redis.ttls.get(`trainer:learned-summary:${USER}`)).toBe(60 * 60 * 24 * 7)
  })

  it('is rebuilt after a learned change', async () => {
    const { service, repo } = setup()
    await service.learnedSummary(USER)

    await service.setLearned(USER, { methodSlug: 'pll', caseId: 'aa', learned: true })
    repo.learned.add(`${USER}|pll|aa`)

    expect((await service.learnedSummary(USER)).total).toBe(1)
  })
})

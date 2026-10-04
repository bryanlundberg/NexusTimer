import { TRAINER_PAGE_SIZE, type TrainerSolveItem } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { createLearnedCache, createSolvesCache } from '../src/modules/trainer/trainer.cache'
import { fakeRedis } from './fake-redis'

const USER = 'user-1'
const METHOD = 'pll'
const WEEK = 60 * 60 * 24 * 7
const LEARNED_KEY = `trainer:learned:${USER}:${METHOD}`
const SOLVES_KEY = `trainer:solves:${USER}:${METHOD}`

const solve = (id: string): TrainerSolveItem => ({
  _id: id,
  user: USER,
  methodSlug: METHOD,
  caseId: 'case-a',
  timeMs: 1000,
  createdAt: '2026-10-04T10:00:00.000Z',
  updatedAt: '2026-10-04T10:00:00.000Z'
})

describe('learned cache', () => {
  it('misses until primed, then serves the ids, including an empty list', async () => {
    const redis = fakeRedis()
    const cache = createLearnedCache(redis.provider)

    expect(await cache.get(USER, METHOD)).toBeNull()

    await cache.prime(USER, METHOD, [])
    expect(await cache.get(USER, METHOD)).toEqual([])

    await cache.prime(USER, METHOD, ['a', 'b'])
    expect((await cache.get(USER, METHOD))?.sort()).toEqual(['a', 'b'])
    expect(redis.ttls.get(LEARNED_KEY)).toBe(WEEK)
  })

  it('writes through only to a cached set', async () => {
    const redis = fakeRedis()
    const cache = createLearnedCache(redis.provider)

    await cache.setLearned(USER, METHOD, 'a', true)
    expect(redis.sets.has(LEARNED_KEY)).toBe(false)

    await cache.prime(USER, METHOD, ['a'])
    await cache.setLearned(USER, METHOD, 'b', true)
    await cache.setLearned(USER, METHOD, 'a', false)
    expect(await cache.get(USER, METHOD)).toEqual(['b'])
  })

  it('drops the profile summary', async () => {
    const redis = fakeRedis()
    redis.strings.set(`trainer:learned-summary:${USER}`, '{}')

    await createLearnedCache(redis.provider).invalidateSummary(USER)

    expect(redis.strings.size).toBe(0)
  })

  it('degrades to misses when Redis is down', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const redis = fakeRedis()
    redis.state.down = true
    const cache = createLearnedCache(redis.provider)

    expect(await cache.get(USER, METHOD)).toBeNull()
    await expect(cache.prime(USER, METHOD, ['a'])).resolves.toBeUndefined()
    await expect(cache.setLearned(USER, METHOD, 'a', true)).resolves.toBeUndefined()
    await expect(cache.invalidateSummary(USER)).resolves.toBeUndefined()
  })
})

describe('solves cache', () => {
  it('misses on an empty list and on limits beyond the cached window', async () => {
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)

    expect(await cache.getFirstPage(USER, METHOD, 12)).toBeNull()

    await cache.prime(USER, METHOD, [solve('a')], true)
    expect(await cache.getFirstPage(USER, METHOD, TRAINER_PAGE_SIZE + 1)).toBeNull()
  })

  it('serves a complete history shorter than the limit and slices longer ones', async () => {
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)

    await cache.prime(USER, METHOD, [solve('c'), solve('b'), solve('a')], true)

    expect(await cache.getFirstPage(USER, METHOD, 12)).toEqual([solve('c'), solve('b'), solve('a')])
    expect(await cache.getFirstPage(USER, METHOD, 2)).toEqual([solve('c'), solve('b')])
    expect(redis.ttls.get(SOLVES_KEY)).toBe(WEEK)
  })

  it('only answers from a partial window when it is long enough', async () => {
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)

    await cache.prime(USER, METHOD, [solve('b'), solve('a')], false)

    expect(await cache.getFirstPage(USER, METHOD, 3)).toBeNull()
    expect(await cache.getFirstPage(USER, METHOD, 2)).toEqual([solve('b'), solve('a')])
  })

  it('caches an empty complete history but not an empty partial one', async () => {
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)

    await cache.prime(USER, METHOD, [], false)
    expect(redis.lists.has(SOLVES_KEY)).toBe(false)

    await cache.prime(USER, METHOD, [], true)
    expect(await cache.getFirstPage(USER, METHOD, 12)).toEqual([])
  })

  it('prepends new solves to a cached list and lets the sentinel fall off a full window', async () => {
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)

    await cache.push(USER, METHOD, solve('ignored'))
    expect(redis.lists.has(SOLVES_KEY)).toBe(false)

    const full = Array.from({ length: TRAINER_PAGE_SIZE }, (_, i) => solve(`old-${i}`))
    await cache.prime(USER, METHOD, full, true)
    await cache.push(USER, METHOD, solve('new'))

    const list = redis.lists.get(SOLVES_KEY) ?? []
    expect(list).toHaveLength(TRAINER_PAGE_SIZE + 1)
    expect(JSON.parse(list[0]!)).toEqual(solve('new'))
    expect(list).not.toContain('__end__')
  })

  it('drops the list when a write-through fails', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const redis = fakeRedis()
    const cache = createSolvesCache(redis.provider)
    await cache.prime(USER, METHOD, [solve('a')], true)

    redis.state.failNextExec = true
    await cache.push(USER, METHOD, solve('b'))

    expect(redis.lists.has(SOLVES_KEY)).toBe(false)
  })

  it('degrades to misses when Redis is down', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const redis = fakeRedis()
    redis.state.down = true
    const cache = createSolvesCache(redis.provider)

    expect(await cache.getFirstPage(USER, METHOD, 12)).toBeNull()
    await expect(cache.prime(USER, METHOD, [solve('a')], true)).resolves.toBeUndefined()
    await expect(cache.invalidate(USER, METHOD)).resolves.toBeUndefined()
  })
})

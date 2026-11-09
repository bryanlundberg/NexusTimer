import { DEFAULT_PRIVACY, type PrivacySettings, type PublicUser, USER_STATS_VERSION } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type {
  CategoryBests,
  FriendsLeaderboardRepository,
  UserBests
} from '../src/modules/friends-leaderboards/friends-leaderboards.repository'
import {
  createFriendsLeaderboardService,
  type FriendsLeaderboardService
} from '../src/modules/friends-leaderboards/friends-leaderboards.service'
import { createBestsCache } from '../src/modules/friends-leaderboards/friends-leaderboards.cache'
import { fakeRedis } from './fake-redis'
import { buildTestApp, testSessions } from './helpers'

const user = (id: string): PublicUser => ({ _id: id, name: id, username: id, image: `https://img/${id}` })

const cat = (overrides: Partial<CategoryBests> & Pick<CategoryBests, 'category'>): CategoryBests => ({
  count: 10,
  single: null,
  ao5: null,
  ...overrides
})

function setup({
  friends = ['ana', 'ben'],
  bests = [] as UserBests[],
  privacy = {} as Record<string, Partial<PrivacySettings>>,
  missingProfiles = [] as string[]
} = {}) {
  const requested: string[][] = []
  const repository: FriendsLeaderboardRepository = {
    async bests(ids) {
      requested.push(ids)
      return bests.filter((entry) => ids.includes(entry.userId))
    }
  }

  const redis = fakeRedis()
  const cache = createBestsCache(redis.provider)

  const service = createFriendsLeaderboardService({
    repository,
    cache,
    social: { friendIds: async () => friends },
    users: {
      privacyMap: async (ids) => new Map(ids.map((id) => [id, { ...DEFAULT_PRIVACY, ...privacy[id] }])),
      publicProfiles: async (ids) =>
        new Map(ids.filter((id) => !missingProfiles.includes(id)).map((id) => [id, user(id)]))
    }
  })

  return { service, requested, redis, cache, bests }
}

describe('friends leaderboard service', () => {
  it('ranks the viewer and friends by the chosen metric, oldest record first on ties', async () => {
    const { service } = setup({
      bests: [
        { userId: 'me', categories: [cat({ category: '4x4', single: { time: 40000, endTime: 3 } })] },
        { userId: 'ana', categories: [cat({ category: '4x4', single: { time: 35000, endTime: 5 }, count: 7 })] },
        { userId: 'ben', categories: [cat({ category: '4x4', single: { time: 40000, endTime: 1 } })] }
      ]
    })

    const { rows, friendCount } = await service.get('me', { category: '4x4', metric: 'single' })

    expect(rows.map((row) => [row.user._id, row.time, row.isSelf])).toEqual([
      ['ana', 35000, false],
      ['ben', 40000, false],
      ['me', 40000, true]
    ])
    expect(rows[0]).toMatchObject({ count: 7, achievedAt: new Date(5).toISOString() })
    expect(friendCount).toBe(2)
  })

  it('ranks by ao5 and leaves out people without one', async () => {
    const { service } = setup({
      bests: [
        { userId: 'me', categories: [cat({ category: 'Skewb', single: { time: 3000, endTime: 1 } })] },
        {
          userId: 'ana',
          categories: [cat({ category: 'Skewb', single: { time: 2000, endTime: 1 }, ao5: { time: 4000, endTime: 2 } })]
        }
      ]
    })

    const { rows } = await service.get('me', { category: 'Skewb', metric: 'ao5' })

    expect(rows.map((row) => [row.user._id, row.time])).toEqual([['ana', 4000]])
  })

  it('lists every category anyone in the group has a time in, in canonical order', async () => {
    const { service } = setup({
      bests: [
        { userId: 'me', categories: [cat({ category: 'Clock', single: { time: 9000, endTime: 1 } })] },
        {
          userId: 'ana',
          categories: [
            cat({ category: '2x2', single: { time: 2000, endTime: 1 } }),
            cat({ category: '7x7', single: null, ao5: null })
          ]
        }
      ]
    })

    const { categories } = await service.get('me', { category: '3x3', metric: 'ao5' })

    expect(categories).toEqual(['2x2', 'Clock'])
  })

  it('hides friends whose stats are private but always keeps the viewer', async () => {
    const { service, requested } = setup({
      privacy: {
        ana: { statsVisibility: 'nobody' },
        ben: { statsVisibility: 'friends' },
        me: { statsVisibility: 'nobody' }
      },
      bests: [
        { userId: 'me', categories: [cat({ category: '3x3', single: { time: 9000, endTime: 1 } })] },
        { userId: 'ana', categories: [cat({ category: '3x3', single: { time: 5000, endTime: 1 } })] },
        { userId: 'ben', categories: [cat({ category: '3x3', single: { time: 7000, endTime: 1 } })] }
      ]
    })

    const { rows, friendCount } = await service.get('me', { category: '3x3', metric: 'single' })

    expect(requested).toEqual([['me', 'ben']])
    expect(rows.map((row) => row.user._id)).toEqual(['ben', 'me'])
    expect(friendCount).toBe(2)
  })

  it('drops rows whose profile no longer exists', async () => {
    const { service } = setup({
      missingProfiles: ['ana'],
      bests: [{ userId: 'ana', categories: [cat({ category: '3x3', single: { time: 5000, endTime: 1 } })] }]
    })

    const { rows } = await service.get('me', { category: '3x3', metric: 'single' })

    expect(rows).toEqual([])
  })

  it('answers an empty board for a viewer without friends or stats', async () => {
    const { service } = setup({ friends: [] })

    expect(await service.get('me', { category: '3x3', metric: 'single' })).toEqual({
      rows: [],
      categories: [],
      friendCount: 0
    })
  })
})

describe('friends leaderboard bests cache', () => {
  const ana = { userId: 'ana', categories: [cat({ category: '3x3', single: { time: 5000, endTime: 1 } })] }

  it('reads Mongo once per person and serves later boards from Redis, whatever the category or metric', async () => {
    const { service, requested } = setup({ bests: [ana] })

    await service.get('me', { category: '3x3', metric: 'single' })
    const { rows } = await service.get('me', { category: '4x4', metric: 'ao5' })
    const again = await service.get('me', { category: '3x3', metric: 'single' })

    expect(requested).toEqual([['me', 'ana', 'ben']])
    expect(rows).toEqual([])
    expect(again.rows.map((row) => row.user._id)).toEqual(['ana'])
  })

  it('remembers people without stats so they do not go back to Mongo', async () => {
    const { service, redis } = setup({ bests: [ana] })

    await service.get('me', { category: '3x3', metric: 'single' })

    const keyFor = (id: string) => [...redis.strings.keys()].find((key) => key.endsWith(`:${id}`))!
    expect(redis.strings.size).toBe(3)
    expect(redis.strings.get(keyFor('ben'))).toBe('[]')
    expect(redis.strings.get(keyFor('me'))).toBe('[]')
    expect(keyFor('ana')).toBe(`friends-leaderboard:bests:v${USER_STATS_VERSION}:ana`)
    expect([...redis.ttls.values()]).toEqual([86400, 86400, 86400])
  })

  it('reloads only the person whose entry was invalidated', async () => {
    const { service, requested, cache, bests } = setup({ bests: [ana] })

    await service.get('me', { category: '3x3', metric: 'single' })
    bests[0] = { userId: 'ana', categories: [cat({ category: '3x3', single: { time: 4000, endTime: 2 } })] }
    await cache.invalidate('ana')
    const { rows } = await service.get('me', { category: '3x3', metric: 'single' })

    expect(requested).toEqual([['me', 'ana', 'ben'], ['ana']])
    expect(rows[0]?.time).toBe(4000)
  })

  it('falls back to Mongo when Redis is down', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { service, requested, redis } = setup({ bests: [ana] })
    redis.state.down = true

    const { rows } = await service.get('me', { category: '3x3', metric: 'single' })
    await service.get('me', { category: '3x3', metric: 'single' })

    expect(rows.map((row) => row.user._id)).toEqual(['ana'])
    expect(requested).toHaveLength(2)
  })
})

describe('GET /api/v1/leaderboards/friends', () => {
  const empty = { rows: [], categories: [], friendCount: 0 }

  function appWith(get: FriendsLeaderboardService['get'], userId: string | null = 'me') {
    return buildTestApp({ sessions: testSessions(userId), friendsLeaderboard: { get } })
  }

  it('answers the viewer board privately, defaulting to singles', async () => {
    const get = vi.fn(() => Promise.resolve(empty))

    const res = await appWith(get).request('/api/v1/leaderboards/friends?category=3x3%20OH')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(empty)
    expect(res.headers.get('cache-control')).toBe('private, no-store')
    expect(get).toHaveBeenCalledWith('me', { category: '3x3 OH', metric: 'single' })
  })

  it('requires a session', async () => {
    const res = await appWith(() => Promise.resolve(empty), null).request('/api/v1/leaderboards/friends?category=3x3')

    expect(res.status).toBe(401)
  })

  it('rejects an unknown category', async () => {
    const res = await appWith(() => Promise.resolve(empty)).request('/api/v1/leaderboards/friends?category=8x8')

    expect(res.status).toBe(400)
  })

  it('hides failures behind a 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await appWith(() => Promise.reject(new Error('mongo down'))).request(
      '/api/v1/leaderboards/friends?category=3x3&metric=ao5'
    )

    expect(res.status).toBe(500)
  })

  it('leaves the global board where it was', async () => {
    const get = vi.fn(() => Promise.resolve({ solves: [], nextRefreshAt: 'x', secondsUntilNextRefresh: 1 }))

    const res = await buildTestApp({ leaderboards: { get } }).request('/api/v1/leaderboards')

    expect(res.status).toBe(200)
    expect(get).toHaveBeenCalledOnce()
  })
})

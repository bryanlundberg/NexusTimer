import type { LeaderboardSolve, PublicUser } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import type { LeaderboardCache } from '../src/modules/solves/leaderboards.cache'
import { createLeaderboardsService } from '../src/modules/solves/leaderboards.service'
import type { SolveFilter, SolvesRepository, StoredSolve } from '../src/modules/solves/solves.repository'
import type { UsersService } from '../src/modules/users/users.service'

const NOW = Date.parse('2026-10-04T13:20:00.000Z')
const WINDOW_START = Date.parse('2026-10-04T13:00:00.000Z')

const ana: PublicUser = { _id: 'u1', name: 'Ana', image: 'https://img/ana', country: 'MX' }

const stored = (overrides: Partial<StoredSolve> = {}): StoredSolve => ({
  id: 's1',
  userId: 'u1',
  time: 5230,
  scramble: "R U R' U'",
  puzzle: '3x3x3',
  smart: false,
  createdAt: new Date('2026-10-01T10:00:00.000Z'),
  updatedAt: new Date('2026-10-01T10:00:00.000Z'),
  ...overrides
})

function setup({
  solves = [stored()],
  cached = null
}: { solves?: StoredSolve[]; cached?: LeaderboardSolve[] | null } = {}) {
  const calls: { method: string; filter: SolveFilter; limit: number }[] = []
  const writes: { windowStartedAt: number; variant: string; ttlSeconds: number; solves: LeaderboardSolve[] }[] = []
  const reads: string[] = []

  const repository: SolvesRepository = {
    async fastest(filter, limit) {
      calls.push({ method: 'fastest', filter, limit })
      return solves
    },
    async fastestPerUser(filter, limit) {
      calls.push({ method: 'fastestPerUser', filter, limit })
      return solves
    }
  }
  const users: Pick<UsersService, 'publicProfiles'> = {
    async publicProfiles(ids) {
      return new Map([ana].filter((user) => ids.includes(user._id)).map((user) => [user._id, user]))
    }
  }
  const cache: LeaderboardCache = {
    async get(windowStartedAt, variant) {
      reads.push(`${windowStartedAt}:${variant}`)
      return cached
    },
    async set(windowStartedAt, variant, solves, ttlSeconds) {
      writes.push({ windowStartedAt, variant, ttlSeconds, solves })
    }
  }

  const service = createLeaderboardsService({ solves: repository, users, cache, now: () => NOW })
  return { service, calls, writes, reads }
}

describe('leaderboards service', () => {
  it('reads the fastest solves, joins public profiles and caches them for the rest of the hour', async () => {
    const { service, calls, writes } = setup()

    const result = await service.get({ puzzle: '3x3x3', smart: false })

    expect(calls).toEqual([{ method: 'fastest', filter: { puzzle: '3x3x3', smart: false }, limit: 100 }])
    expect(result).toEqual({
      solves: [
        {
          _id: 's1',
          user: ana,
          time: 5230,
          scramble: "R U R' U'",
          puzzle: '3x3x3',
          smart: false,
          createdAt: '2026-10-01T10:00:00.000Z',
          updatedAt: '2026-10-01T10:00:00.000Z'
        }
      ],
      nextRefreshAt: '2026-10-04T14:00:00.000Z',
      secondsUntilNextRefresh: 40 * 60
    })
    expect(writes).toEqual([
      { windowStartedAt: WINDOW_START, variant: '3x3x3:false:all', ttlSeconds: 2400, solves: result.solves }
    ])
  })

  it('uses the best solve per user for unique boards', async () => {
    const { service, calls, reads } = setup()

    await service.get({ unique: true })

    expect(calls).toEqual([{ method: 'fastestPerUser', filter: {}, limit: 100 }])
    expect(reads).toEqual([`${WINDOW_START}:any:any:unique`])
  })

  it('serves a cached board without touching the database', async () => {
    const cached = [{ _id: 'cached' }] as LeaderboardSolve[]
    const { service, calls, writes } = setup({ cached })

    const result = await service.get({})

    expect(result.solves).toBe(cached)
    expect(calls).toHaveLength(0)
    expect(writes).toHaveLength(0)
  })

  it('keeps stored nulls, omits missing fields and drops solves of deleted users', async () => {
    const replay = { version: 1 as const, puzzle: '3x3x3', scramble: 'R', durationMs: 900, moves: [{ m: 'R', t: 0 }] }
    const { service } = setup({
      solves: [
        stored({ id: 'with-nulls', solution: null, replay: null }),
        stored({ id: 'with-replay', solution: 'R', replay }),
        stored({ id: 'bare' }),
        stored({ id: 'orphan', userId: 'deleted' })
      ]
    })

    const { solves } = await service.get({})

    expect(solves.map((solve) => solve._id)).toEqual(['with-nulls', 'with-replay', 'bare'])
    expect(solves[0]).toMatchObject({ solution: null, replay: null })
    expect(solves[1]).toMatchObject({ solution: 'R', replay })
    expect(solves[2]).not.toHaveProperty('solution')
    expect(solves[2]).not.toHaveProperty('replay')
  })
})

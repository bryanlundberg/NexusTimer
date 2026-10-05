import type { PublicUser, ShareSolveInput } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { createSharedSolvesCache } from '../src/modules/shared-solves/shared-solves.cache'
import { createShareQuota } from '../src/modules/shared-solves/shared-solves.quota'
import type {
  InsertResult,
  SharedSolvesRepository,
  StoredSharedSolve
} from '../src/modules/shared-solves/shared-solves.repository'
import { createSharedSolvesService } from '../src/modules/shared-solves/shared-solves.service'
import type { BlockState } from '../src/modules/social/blocks.repository'
import { fakeRedis } from './fake-redis'

const OWNER = 'owner-1'
const VIEWER = 'viewer-1'

const input: ShareSolveInput = {
  localSolveId: 'local-1',
  puzzle: '3x3',
  time: 9043,
  plus2: false,
  dnf: false,
  scramble: "R U R' U'",
  solvedAt: 1_700_000_000_000
}

const replay = { version: 1 as const, puzzle: '3x3x3', scramble: "R U R' U'", durationMs: 9043, moves: [] }

function fakeRepository() {
  const solves = new Map<string, StoredSharedSolve & { localSolveId: string }>()
  const calls = { findBySlug: 0, idsByLocalSolve: 0 }
  const insertResults: InsertResult[] = []

  const repository: SharedSolvesRepository = {
    async slugForLocalSolve(userId, localSolveId) {
      return (
        [...solves.values()].find((s) => s.ownerId === userId && s.localSolveId === localSolveId)?.item.slug ?? null
      )
    },
    async insert(userId, slug, data) {
      const forced = insertResults.shift()
      if (forced) return forced
      solves.set(slug, {
        ownerId: userId,
        localSolveId: data.localSolveId,
        item: {
          slug,
          puzzle: data.puzzle,
          time: data.time,
          plus2: data.plus2,
          dnf: data.dnf,
          scramble: data.scramble,
          solvedAt: data.solvedAt,
          hasReplay: !!data.replay,
          sharedAt: '2026-10-04T10:00:00.000Z'
        },
        ...(data.replay ? { replay: data.replay } : {})
      })
      return 'created'
    },
    async deleteBySlug(userId, slug) {
      const solve = solves.get(slug)
      if (!solve || solve.ownerId !== userId) return false
      return solves.delete(slug)
    },
    async findBySlug(slug) {
      calls.findBySlug++
      const solve = solves.get(slug)
      if (!solve) return null
      const { localSolveId: _, ...stored } = solve
      return stored
    },
    async pageForUser(userId, before, limit) {
      const owned = [...solves.entries()]
        .filter(([, solve]) => solve.ownerId === userId)
        .map(([id, solve]) => ({ id, item: solve.item }))
        .sort((a, b) => b.id.localeCompare(a.id))
        .filter(({ id }) => !before || id < before)
        .slice(0, limit)
      return { items: owned.map(({ item }) => item), lastId: owned[owned.length - 1]?.id ?? null }
    },
    async countForUser(userId) {
      return [...solves.values()].filter((solve) => solve.ownerId === userId).length
    },
    async slugsForUser(userId) {
      return [...solves.values()].filter((solve) => solve.ownerId === userId).map((solve) => solve.item.slug)
    },
    async idsByLocalSolve(userId) {
      calls.idsByLocalSolve++
      return Object.fromEntries(
        [...solves.values()].filter((s) => s.ownerId === userId).map((s) => [s.localSolveId, s.item.slug])
      )
    }
  }

  return { repository, solves, calls, insertResults }
}

function setup({
  profiles = { [OWNER]: { _id: OWNER, name: 'Ana', image: 'https://img/ana', country: 'MX', goal: 'sub 10' } },
  blocks = 'none' as BlockState
}: { profiles?: Record<string, PublicUser>; blocks?: BlockState } = {}) {
  const redis = fakeRedis()
  const repo = fakeRepository()
  const slugs = ['AAAAAAAAAA', 'BBBBBBBBBB', 'CCCCCCCCCC', 'DDDDDDDDDD']
  const blockChecks: [string, string][] = []

  const service = createSharedSolvesService({
    repository: repo.repository,
    cache: createSharedSolvesCache(redis.provider),
    quota: createShareQuota(redis.provider),
    users: {
      async publicProfiles(ids) {
        return new Map(ids.flatMap((id) => (profiles[id] ? [[id, profiles[id]] as const] : [])))
      }
    },
    social: {
      async blockState(userId, otherId) {
        blockChecks.push([userId, otherId])
        return blocks
      }
    },
    generateSlug: () => slugs.shift() ?? 'ZZZZZZZZZZ'
  })

  return { service, repo, redis, blockChecks }
}

describe('shared solves service', () => {
  it('shares a solve once and answers the same slug afterwards', async () => {
    const { service, repo } = setup()

    expect(await service.share(OWNER, input)).toEqual({ status: 'created', slug: 'AAAAAAAAAA' })
    expect(await service.share(OWNER, input)).toEqual({ status: 'existing', slug: 'AAAAAAAAAA' })
    expect(await service.myIds(OWNER)).toEqual({ 'local-1': 'AAAAAAAAAA' })
    expect(repo.solves.size).toBe(1)
  })

  it('caches the ids and drops them when a new solve is shared', async () => {
    const { service, repo } = setup()

    await service.myIds(OWNER)
    await service.myIds(OWNER)
    expect(repo.calls.idsByLocalSolve).toBe(1)

    await service.share(OWNER, input)
    expect(await service.myIds(OWNER)).toEqual({ 'local-1': 'AAAAAAAAAA' })
    expect(repo.calls.idsByLocalSolve).toBe(2)
  })

  it('limits new shares to thirty per hour', async () => {
    const { service, redis } = setup()
    redis.strings.set(`shared-solves:hourly:${OWNER}`, '30')

    expect(await service.share(OWNER, input)).toEqual({ status: 'rate-limited' })
  })

  it('retries on a slug collision and gives up after three', async () => {
    const retried = setup()
    retried.repo.insertResults.push('duplicate-slug')
    expect(await retried.service.share(OWNER, input)).toEqual({ status: 'created', slug: 'BBBBBBBBBB' })

    const exhausted = setup()
    exhausted.repo.insertResults.push('duplicate-slug', 'duplicate-slug', 'duplicate-slug')
    await expect(exhausted.service.share(OWNER, input)).rejects.toThrow('Could not allocate a unique slug')
  })

  it('returns the winner of a concurrent share of the same solve', async () => {
    const { service, repo } = setup()
    let lookups = 0
    repo.repository.slugForLocalSolve = async () => (lookups++ === 0 ? null : 'WINNER0000')
    repo.insertResults.push('duplicate-local-solve')

    expect(await service.share(OWNER, input)).toEqual({ status: 'existing', slug: 'WINNER0000' })
  })

  it('builds the public detail with the author and the replay', async () => {
    const { service } = setup()
    await service.share(OWNER, { ...input, replay })

    const detail = await service.detail('AAAAAAAAAA', VIEWER)

    expect(detail).toMatchObject({
      slug: 'AAAAAAAAAA',
      hasReplay: true,
      author: { _id: OWNER, name: 'Ana', image: 'https://img/ana', country: 'MX' },
      replay,
      isOwner: false
    })
    expect(detail?.author).not.toHaveProperty('goal')
    expect((await service.detail('AAAAAAAAAA', OWNER))?.isOwner).toBe(true)
  })

  it('remembers unknown slugs so repeated misses skip the database', async () => {
    const { service, repo } = setup()

    expect(await service.detail('NOPENOPE00', null)).toBeNull()
    expect(await service.detail('NOPENOPE00', null)).toBeNull()
    expect(repo.calls.findBySlug).toBe(1)
  })

  it('hides the solve when either side blocked the other, but never from the owner or anonymous viewers', async () => {
    const blocked = setup({ blocks: 'blocked_by' })
    await blocked.service.share(OWNER, input)

    expect(await blocked.service.detail('AAAAAAAAAA', VIEWER)).toBeNull()
    expect(await blocked.service.detail('AAAAAAAAAA', OWNER)).not.toBeNull()
    expect(await blocked.service.detail('AAAAAAAAAA', null)).not.toBeNull()
    expect(blocked.blockChecks).toEqual([[VIEWER, OWNER]])
  })

  it('hides solves whose author no longer exists', async () => {
    const { service } = setup({ profiles: {} })
    await service.share(OWNER, input)

    expect(await service.detail('AAAAAAAAAA', null)).toBeNull()
  })

  it('only lets the owner delete, and forgets the cached detail', async () => {
    const { service } = setup()
    await service.share(OWNER, input)
    await service.detail('AAAAAAAAAA', null)

    expect(await service.remove(VIEWER, 'AAAAAAAAAA')).toBe(false)
    expect(await service.remove(OWNER, 'AAAAAAAAAA')).toBe(true)
    expect(await service.detail('AAAAAAAAAA', null)).toBeNull()
  })
})

describe('shared solves of a user', () => {
  it('serves the first page from the cache until the user shares again', async () => {
    const { service, repo } = setup()
    await service.share(OWNER, input)

    const first = await service.userPage(OWNER, null, null)
    repo.solves.clear()

    expect(first).toMatchObject({ total: 1, nextCursor: null, items: [{ slug: 'AAAAAAAAAA' }] })
    expect(await service.userPage(OWNER, null, null)).toEqual(first)

    await service.share(OWNER, { ...input, localSolveId: 'local-2' })
    expect((await service.userPage(OWNER, null, null)).items.map((item) => item.slug)).toEqual(['BBBBBBBBBB'])
  })

  it('answers an empty page to viewers blocked either way', async () => {
    const { service } = setup({ blocks: 'blocked' })
    await service.share(OWNER, input)

    expect(await service.userPage(OWNER, VIEWER, null)).toEqual({ items: [], total: 0, nextCursor: null })
    expect((await service.userPage(OWNER, OWNER, null)).total).toBe(1)
  })
})

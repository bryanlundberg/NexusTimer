import { sharedSolveCache } from '@/entities/shared-solve/model/shared-solve-cache'
import type { CachedSharedSolve } from '@/entities/shared-solve/model/shared-solve-cache'

const store = new Map<string, string>()
const ttls = new Map<string, number>()

vi.mock('@/shared/config/redis/redis', () => ({
  getRedis: async () => ({
    get: async (key: string) => store.get(key) ?? null,
    set: async (key: string, value: string, options: { EX: number }) => {
      store.set(key, value)
      ttls.set(key, options.EX)
    },
    del: async (keys: string[]) => keys.forEach((key) => store.delete(key))
  })
}))

const solve: CachedSharedSolve = {
  ownerId: 'user-1',
  item: {
    slug: 'k3Fq9xP2aL',
    puzzle: '3x3',
    time: 9043,
    plus2: false,
    dnf: false,
    scramble: "R U R' U'",
    solvedAt: 1_700_000_000_000,
    hasReplay: false,
    sharedAt: '2026-09-22T00:00:00.000Z'
  }
}

beforeEach(() => {
  store.clear()
  ttls.clear()
})

describe('sharedSolveCache', () => {
  it('returns null on a cold slug and the solve once primed', async () => {
    expect(await sharedSolveCache.getBySlug('k3Fq9xP2aL')).toBeNull()
    await sharedSolveCache.primeSlug('k3Fq9xP2aL', solve)
    expect(await sharedSolveCache.getBySlug('k3Fq9xP2aL')).toEqual(solve)
  })

  it('remembers unknown slugs briefly', async () => {
    await sharedSolveCache.primeSlug('AAAAAAAAAA', null)
    expect(await sharedSolveCache.getBySlug('AAAAAAAAAA')).toBe('missing')
    expect(ttls.get('shared-solve:slug:AAAAAAAAAA')).toBe(300)
  })

  it('invalidate drops the owner list, ids and the given slugs', async () => {
    await sharedSolveCache.primeSlug('k3Fq9xP2aL', solve)
    await sharedSolveCache.primeFirstPage('user-1', { items: [solve.item], total: 1, nextCursor: null })
    await sharedSolveCache.primeIds('user-1', { 'local-1': 'k3Fq9xP2aL' })

    await sharedSolveCache.invalidate('user-1', ['k3Fq9xP2aL'])

    expect(await sharedSolveCache.getBySlug('k3Fq9xP2aL')).toBeNull()
    expect(await sharedSolveCache.getFirstPage('user-1')).toBeNull()
    expect(await sharedSolveCache.getIds('user-1')).toBeNull()
  })

  it('keeps an empty ids map distinct from a miss', async () => {
    await sharedSolveCache.primeIds('user-2', {})
    expect(await sharedSolveCache.getIds('user-2')).toEqual({})
  })
})

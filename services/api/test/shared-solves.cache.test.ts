import { describe, expect, it } from 'vitest'
import { createSharedSolvesCache } from '../src/modules/shared-solves/shared-solves.cache'
import { fakeRedis } from './fake-redis'

describe('shared solves cache', () => {
  it('keeps an empty ids map distinct from a miss', async () => {
    const cache = createSharedSolvesCache(fakeRedis().provider)

    expect(await cache.getIds('user-1')).toBeNull()
    await cache.primeIds('user-1', {})
    expect(await cache.getIds('user-1')).toEqual({})
  })

  it('remembers unknown slugs for five minutes', async () => {
    const redis = fakeRedis()
    const cache = createSharedSolvesCache(redis.provider)

    await cache.primeSlug('AAAAAAAAAA', null)

    expect(await cache.getBySlug('AAAAAAAAAA')).toBe('missing')
    expect(redis.ttls.get('shared-solve:slug:AAAAAAAAAA')).toBe(300)
  })

  it('invalidate drops the owner list, ids and the given slugs', async () => {
    const redis = fakeRedis()
    const cache = createSharedSolvesCache(redis.provider)
    await cache.primeIds('user-1', { 'local-1': 'k3Fq9xP2aL' })
    await cache.primeFirstPage('user-1', { items: [], total: 0, nextCursor: null })
    await cache.primeSlug('k3Fq9xP2aL', null)

    await cache.invalidate('user-1', ['k3Fq9xP2aL'])

    expect(redis.strings.size).toBe(0)
  })
})

import type { AchievementRarityInput } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { RarityCache } from '../src/modules/achievements/achievements.cache'
import type { AchievementsRepository } from '../src/modules/achievements/achievements.repository'
import { createAchievementsService } from '../src/modules/achievements/achievements.service'
import { buildTestApp } from './helpers'

const stats: AchievementRarityInput = {
  registeredUsers: 10,
  scannedUsers: 9,
  failedUsers: 1,
  computedAt: new Date('2026-10-04T00:00:00.000Z'),
  badges: { contributor: { holders: 2, pct: 20 }, 'bug-hunter': { holders: 1, pct: 10 } }
}

const response = { computedAt: '2026-10-04T00:00:00.000Z', badges: { contributor: 20, 'bug-hunter': 10 } }

const unused = () => Promise.reject(new Error('unused'))

function repositoryWith(rarity: AchievementsRepository['rarity']): AchievementsRepository {
  return { grantedKeys: unused, list: unused, grant: unused, revoke: unused, saveRarity: unused, rarity }
}

describe('achievements service rarity', () => {
  it('answers from the cache without touching mongo', async () => {
    const rarity = vi.fn(unused)
    const cache: RarityCache = { get: async () => stats, set: vi.fn() }

    expect(await createAchievementsService(repositoryWith(rarity), cache).rarity()).toEqual(response)
    expect(rarity).not.toHaveBeenCalled()
  })

  it('falls back to mongo and warms the cache', async () => {
    const cache: RarityCache = { get: async () => null, set: vi.fn(async () => {}) }

    const repository = repositoryWith(async () => stats)
    const service = createAchievementsService(repository, cache)

    expect(await service.rarity()).toEqual(response)
    expect(cache.set).toHaveBeenCalledWith(stats)
  })

  it('answers null when rarity was never computed', async () => {
    const cache: RarityCache = { get: async () => null, set: vi.fn() }

    const repository = repositoryWith(async () => null)
    const service = createAchievementsService(repository, cache)

    expect(await service.rarity()).toBeNull()
    expect(cache.set).not.toHaveBeenCalled()
  })
})

describe('GET /api/v1/achievements/rarity', () => {
  it('serves the percentages with a long shared cache', async () => {
    const res = await buildTestApp({ achievements: { rarity: async () => response } }).request(
      '/api/v1/achievements/rarity'
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(response)
    expect(res.headers.get('cache-control')).toBe('public, max-age=3600, s-maxage=21600')
  })

  it('keeps an empty answer only briefly', async () => {
    const res = await buildTestApp({ achievements: { rarity: async () => null } }).request(
      '/api/v1/achievements/rarity'
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toBeNull()
    expect(res.headers.get('cache-control')).toBe('public, max-age=0, s-maxage=300')
  })

  it('hides failures behind a 500', async () => {
    const res = await buildTestApp({ achievements: { rarity: unused } }).request('/api/v1/achievements/rarity')

    expect(res.status).toBe(500)
  })
})

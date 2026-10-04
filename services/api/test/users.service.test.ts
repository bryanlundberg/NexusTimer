import { USER_STATS_VERSION, type UserStatsSummary } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { createProfileCache, createStatsCache } from '../src/modules/users/users.cache'
import type { UsersRepository } from '../src/modules/users/users.repository'
import { buildProfileUpdate, createUsersService } from '../src/modules/users/users.service'
import { fakeRedis } from './fake-redis'

describe('users service', () => {
  it('reads cached profiles first, keeps only public fields and asks the database for the rest', async () => {
    const redis = fakeRedis()
    redis.strings.set(
      'user:profile:u1',
      JSON.stringify({ _id: 'u1', name: 'Ana', image: 'a.png', email: 'ana@private.test', country: 'MX', bio: 'hi' })
    )
    const asked: string[][] = []
    const repository = {
      async findPublicProfiles(ids: string[]) {
        asked.push(ids)
        return ids.map((id) => ({ _id: id, name: `name ${id}`, image: `${id}.png` }))
      }
    } as unknown as UsersRepository

    const profiles = await createUsersService({
      repository,
      profileCache: createProfileCache(redis.provider),
      statsCache: createStatsCache(redis.provider),
      achievements: { grantedKeys: async () => [] }
    }).publicProfiles(['u1', 'u2', 'u2'])

    expect(profiles.get('u1')).toEqual({ _id: 'u1', name: 'Ana', image: 'a.png', country: 'MX' })
    expect(profiles.get('u2')).toEqual({ _id: 'u2', name: 'name u2', image: 'u2.png' })
    expect(asked).toEqual([['u2']])
  })

  it('falls back to the database when Redis is down', async () => {
    const redis = fakeRedis()
    redis.state.down = true
    const repository = {
      findPublicProfiles: async (ids: string[]) => ids.map((id) => ({ _id: id, name: id, image: '' }))
    } as unknown as UsersRepository

    const profiles = await createUsersService({
      repository,
      profileCache: createProfileCache(redis.provider),
      statsCache: createStatsCache(redis.provider),
      achievements: { grantedKeys: async () => [] }
    }).publicProfiles(['u1'])

    expect([...profiles.keys()]).toEqual(['u1'])
  })
})

describe('buildProfileUpdate', () => {
  it('sets values, unsets cleared ones and skips untouched fields', () => {
    expect(buildProfileUpdate({ name: 'Ana', bio: null, links: [], goal: undefined })).toEqual({
      $set: { name: 'Ana' },
      $unset: { bio: '', links: '' }
    })
    expect(buildProfileUpdate({ goal: undefined })).toBeNull()
  })

  it('omits the operator that has nothing to do', () => {
    expect(buildProfileUpdate({ image: 'https://example.com/a.png' })).toEqual({
      $set: { image: 'https://example.com/a.png' }
    })
    expect(buildProfileUpdate({ country: null })).toEqual({ $unset: { country: '' } })
    expect(buildProfileUpdate({})).toBeNull()
  })
})

describe('users service profiles and stats', () => {
  const profile = {
    _id: 'u1',
    name: 'Ana',
    image: 'a.png',
    backup: { url: 'b.json', updatedAt: 100 },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
  const summary = { totalSolves: 3 } as unknown as UserStatsSummary

  function setup(snapshot: { version: number; backupUpdatedAt: number } | null = null) {
    const redis = fakeRedis()
    const calls = { findProfile: 0, statsSnapshot: 0, backupUpdatedAt: 0 }
    const repository = {
      async findProfile() {
        calls.findProfile++
        return profile
      },
      async updateProfile() {
        return profile
      },
      async backupUpdatedAt() {
        calls.backupUpdatedAt++
        return 100
      },
      async statsSnapshot() {
        calls.statsSnapshot++
        return snapshot && { ...snapshot, summary }
      }
    } as unknown as UsersRepository
    const service = createUsersService({
      repository,
      profileCache: createProfileCache(redis.provider),
      statsCache: createStatsCache(redis.provider),
      achievements: { grantedKeys: async () => ['early'] }
    })
    return { service, redis, calls }
  }

  it('builds the profile once with its achievements and serves it from the cache', async () => {
    const { service, calls } = setup()

    expect(await service.profile('u1')).toEqual({ ...profile, grantedAchievements: ['early'] })
    expect(await service.profile('u1')).toEqual({ ...profile, grantedAchievements: ['early'] })
    expect(calls.findProfile).toBe(1)
  })

  it('drops the cached profile after an update', async () => {
    const { service, redis } = setup()
    await service.profile('u1')

    await service.updateProfile('u1', { name: 'Ana B' })

    expect(redis.strings.has('user:profile:u1')).toBe(false)
  })

  it('serves stats only when they match the current backup and stats version', async () => {
    const fresh = setup({ version: USER_STATS_VERSION, backupUpdatedAt: 100 })
    expect(await fresh.service.statsSummary('u1')).toBe(summary)
    expect(await fresh.service.statsSummary('u1')).toEqual(summary)
    expect(fresh.calls.statsSnapshot).toBe(1)

    const outdatedBackup = setup({ version: USER_STATS_VERSION, backupUpdatedAt: 99 })
    expect(await outdatedBackup.service.statsSummary('u1')).toBeNull()

    const oldVersion = setup({ version: USER_STATS_VERSION - 1, backupUpdatedAt: 100 })
    expect(await oldVersion.service.statsSummary('u1')).toBeNull()
  })

  it('replaces a cached summary from an older backup with the fresh one from the database', async () => {
    const { service, redis, calls } = setup({ version: USER_STATS_VERSION, backupUpdatedAt: 100 })
    redis.strings.set(
      'user:stats:u1',
      JSON.stringify({ version: USER_STATS_VERSION, backupUpdatedAt: 50, summary: {} })
    )

    expect(await service.statsSummary('u1')).toBe(summary)
    expect(calls.statsSnapshot).toBe(1)
    expect(JSON.parse(redis.strings.get('user:stats:u1')!).backupUpdatedAt).toBe(100)
  })

  it('answers null before the first summary exists', async () => {
    expect(await setup(null).service.statsSummary('u1')).toBeNull()
  })

  it('reads the backup time from a cached profile before asking the database', async () => {
    const { service, calls } = setup({ version: USER_STATS_VERSION, backupUpdatedAt: 100 })
    await service.profile('u1')

    await service.statsSummary('u1')

    expect(calls.backupUpdatedAt).toBe(0)
  })
})

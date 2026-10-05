import { DEFAULT_PRIVACY, type PrivacySettings, type UpdatePrivacyInput } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { PrivacyService } from '../src/modules/users/privacy.routes'
import { createProfileCache, createStatsCache } from '../src/modules/users/users.cache'
import type { UsersRepository } from '../src/modules/users/users.repository'
import { createUsersService } from '../src/modules/users/users.service'
import { fakeRedis } from './fake-redis'
import { buildTestApp, testSessions } from './helpers'

const ME = '64b7f0c2a1b2c3d4e5f60718'

const patch = (body: unknown) => ({
  method: 'PATCH',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

function appWith(overrides: Partial<PrivacyService>, userId: string | null = ME) {
  const unused = () => Promise.reject(new Error('not used'))
  return buildTestApp({
    sessions: testSessions(userId),
    privacy: { privacy: unused, updatePrivacy: unused, ...overrides }
  })
}

describe('privacy routes', () => {
  it('answers 401 without a session', async () => {
    const app = appWith({}, null)

    expect((await app.request('/api/v1/privacy')).status).toBe(401)
    expect((await app.request('/api/v1/privacy', patch({ readReceipts: false }))).status).toBe(401)
  })

  it('returns my settings', async () => {
    const privacy = vi.fn<PrivacyService['privacy']>(() => Promise.resolve(DEFAULT_PRIVACY))

    const res = await appWith({ privacy }).request('/api/v1/privacy')

    expect(await res.json()).toEqual(DEFAULT_PRIVACY)
    expect(privacy).toHaveBeenCalledWith(ME)
  })

  it('refuses empty, unknown and invalid updates', async () => {
    const updatePrivacy = vi.fn<PrivacyService['updatePrivacy']>()
    const app = appWith({ updatePrivacy })

    const empty = await app.request('/api/v1/privacy', patch({}))
    const unknown = await app.request('/api/v1/privacy', patch({ readReceipts: false, theme: 'dark' }))
    const invalid = await app.request('/api/v1/privacy', patch({ statsVisibility: 'friends_of_friends' }))

    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ message: 'Nothing to update' })
    expect(unknown.status).toBe(400)
    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toMatchObject({ message: 'Invalid request' })
    expect(updatePrivacy).not.toHaveBeenCalled()
  })

  it('saves the update and answers the resulting settings', async () => {
    const saved: PrivacySettings = { ...DEFAULT_PRIVACY, friendRequests: 'nobody', readReceipts: false }
    const updatePrivacy = vi.fn<PrivacyService['updatePrivacy']>(() => Promise.resolve(saved))

    const res = await appWith({ updatePrivacy }).request(
      '/api/v1/privacy',
      patch({ friendRequests: 'nobody', readReceipts: false })
    )

    expect(await res.json()).toEqual(saved)
    expect(updatePrivacy).toHaveBeenCalledWith(ME, { friendRequests: 'nobody', readReceipts: false })
  })
})

describe('users service privacy', () => {
  it('writes only the given fields and answers the settings with defaults filled in', async () => {
    const writes: UpdatePrivacyInput[] = []
    const stored: Partial<PrivacySettings> = { statsVisibility: 'friends' }
    const repository = {
      async updatePrivacy(_id: string, input: UpdatePrivacyInput) {
        writes.push(input)
        Object.assign(stored, input)
      },
      privacy: async (ids: string[]) => new Map(ids.map((id) => [id, stored]))
    } as unknown as UsersRepository
    const redis = fakeRedis()

    const users = createUsersService({
      repository,
      profileCache: createProfileCache(redis.provider),
      statsCache: createStatsCache(redis.provider),
      achievements: { grantedKeys: async () => [] }
    })

    expect(await users.updatePrivacy(ME, { typingIndicator: false })).toEqual({
      ...DEFAULT_PRIVACY,
      statsVisibility: 'friends',
      typingIndicator: false
    })
    expect(writes).toEqual([{ typingIndicator: false }])
  })
})

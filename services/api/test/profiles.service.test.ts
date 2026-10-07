import type { PrivacySettings, PublicProfile, StatsVisibility } from '@nexustimer/contracts'
import { DEFAULT_PRIVACY } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { createProfilesService, withoutStats } from '../src/modules/profiles/profiles.service'
import type { ListedUser } from '../src/modules/users/users.repository'

const OWNER = '64b7f0c2a1b2c3d4e5f60718'
const FRIEND = '64b7f0c2a1b2c3d4e5f60719'
const STRANGER = '64b7f0c2a1b2c3d4e5f60720'

const profileOf = (id: string): PublicProfile => ({
  _id: id,
  name: `user ${id.slice(-2)}`,
  image: 'img.png',
  backup: { url: 'https://cdn/backup.json', updatedAt: 1700 },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
})

function setup(visibility: StatsVisibility = 'everyone', listed: ListedUser[] = []) {
  const privacy: PrivacySettings = { ...DEFAULT_PRIVACY, statsVisibility: visibility }
  const users = {
    profile: vi.fn(async (id: string) =>
      id === OWNER ? { ...profileOf(OWNER), grantedAchievements: ['early'] } : null
    ),
    updateProfile: vi.fn(async () => profileOf(OWNER)),
    list: vi.fn(async () => ({ users: listed, total: 51 })),
    privacy: vi.fn(async () => privacy),
    statsSummary: vi.fn(async () => null)
  }
  const social = {
    blockedEitherWay: vi.fn(async () => ['blocked-id']),
    friendIds: vi.fn(async () => [FRIEND]),
    areFriends: vi.fn(async (viewer: string) => viewer === FRIEND)
  }
  const trainer = { learnedSummary: vi.fn(async () => ({ total: 2, methods: [] })) }
  const sharedSolves = { userPage: vi.fn(async () => ({ items: [], total: 3, nextCursor: null })) }

  const service = createProfilesService({ users, social, trainer, sharedSolves })
  return { service, users, social, trainer, sharedSolves }
}

describe('withoutStats', () => {
  it('drops the backup url but keeps when it was updated', () => {
    expect(withoutStats(profileOf(OWNER))).toMatchObject({ backup: { updatedAt: 1700 }, statsHidden: true })
    expect(withoutStats(profileOf(OWNER)).backup).not.toHaveProperty('url')
  })
})

describe('profiles service', () => {
  it.each([
    ['everyone', null, true],
    ['friends', FRIEND, true],
    ['friends', STRANGER, false],
    ['friends', null, false],
    ['nobody', FRIEND, false],
    ['nobody', OWNER, true]
  ] as const)('shows stats with %s visibility to %s: %s', async (visibility, viewer, visible) => {
    const { service } = setup(visibility)

    const profile = await service.profile(OWNER, viewer)

    expect(profile?.grantedAchievements).toEqual(['early'])
    if (visible) expect(profile).not.toHaveProperty('statsHidden')
    else expect(profile).toMatchObject({ statsHidden: true, backup: { updatedAt: 1700 } })
  })

  it.each([
    ['everyone', null],
    ['everyone', STRANGER],
    ['friends', FRIEND],
    ['nobody', STRANGER]
  ] as const)('hides the backup url with %s visibility from %s', async (visibility, viewer) => {
    const { service } = setup(visibility)

    expect((await service.profile(OWNER, viewer))?.backup).toEqual({ updatedAt: 1700 })
  })

  it('gives the backup url to its owner only', async () => {
    const { service } = setup('nobody')

    expect((await service.profile(OWNER, OWNER))?.backup).toEqual({ url: 'https://cdn/backup.json', updatedAt: 1700 })
  })

  it('answers null for unknown users', async () => {
    expect(await setup().service.profile(STRANGER, null)).toBeNull()
  })

  it('lists users without the ones blocked either way and hides stats per their own privacy', async () => {
    const listed: ListedUser[] = [
      { profile: profileOf(FRIEND), privacy: { statsVisibility: 'friends' } },
      { profile: profileOf(STRANGER), privacy: { statsVisibility: 'friends' } },
      { profile: profileOf(OWNER) }
    ]
    const { service, users } = setup('everyone', listed)

    const result = await service.list({ name: 'ana', country: 'MX', page: 3 }, OWNER)

    expect(users.list).toHaveBeenCalledWith({ name: 'ana', country: 'MX', page: 3, excludeIds: ['blocked-id'] }, 25)
    expect(result.events.map((user) => 'statsHidden' in user)).toEqual([false, true, false])
    expect(result.events.map((user) => user.backup)).toEqual([
      { updatedAt: 1700 },
      { updatedAt: 1700 },
      { url: 'https://cdn/backup.json', updatedAt: 1700 }
    ])
    expect(result).toMatchObject({ page: 3, pages: 3, docs: 51 })
  })

  it('does not look up blocks or friends for anonymous viewers', async () => {
    const { service, social, users } = setup()

    await service.list({ name: '', country: '', page: 1 }, null)

    expect(social.blockedEitherWay).not.toHaveBeenCalled()
    expect(users.list).toHaveBeenCalledWith({ name: '', country: '', page: 1, excludeIds: [] }, 25)
  })

  it('guards learned cases and stats behind the same visibility', async () => {
    const hidden = setup('nobody')
    const visible = setup('everyone')

    expect(await hidden.service.learned(OWNER, STRANGER)).toEqual({ total: 0, methods: [], hidden: true })
    expect(await hidden.service.stats(OWNER, STRANGER)).toEqual({ stats: null, hidden: true })
    expect(await visible.service.learned(OWNER, STRANGER)).toEqual({ total: 2, methods: [] })
    expect(await visible.service.stats(OWNER, STRANGER)).toEqual({ stats: null })
    expect(hidden.trainer.learnedSummary).not.toHaveBeenCalled()
  })

  it('answers empty results for malformed ids without touching anything', async () => {
    const { service, users, sharedSolves } = setup()

    expect(await service.learned('nope', null)).toEqual({ total: 0, methods: [] })
    expect(await service.stats('nope', null)).toEqual({ stats: null })
    expect(await service.sharedSolves('nope', null, null)).toEqual({ items: [], total: 0, nextCursor: null })
    expect(users.privacy).not.toHaveBeenCalled()
    expect(sharedSolves.userPage).not.toHaveBeenCalled()
  })

  it('passes the viewer and cursor to the shared solves page', async () => {
    const { service, sharedSolves } = setup()

    await service.sharedSolves(OWNER, STRANGER, 'cursor')

    expect(sharedSolves.userPage).toHaveBeenCalledWith(OWNER, STRANGER, 'cursor')
  })
})

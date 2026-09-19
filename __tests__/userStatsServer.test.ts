import type { Mock } from 'vitest'

const { updateOne, findOne, findById, auth, statsVisibleTo, statsCache, profileCache } = vi.hoisted(() => ({
  updateOne: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  auth: vi.fn(),
  statsVisibleTo: vi.fn(),
  statsCache: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() },
  profileCache: { get: vi.fn() }
}))

vi.mock('@/entities/user-stats/model/user-stats', () => ({ default: { updateOne, findOne } }))
vi.mock('@/entities/user/model/user', () => ({ default: { findById } }))
vi.mock('@/shared/config/mongodb/mongodb', () => ({ default: vi.fn(async () => true) }))
vi.mock('@/shared/config/auth/auth', () => ({ auth }))
vi.mock('@/entities/privacy/server/stats-visibility', () => ({ statsVisibleTo }))
vi.mock('@/entities/user-stats/model/user-stats-cache', () => ({ userStatsCache: statsCache }))
vi.mock('@/entities/user/model/user-cache', () => ({ userProfileCache: profileCache }))

import { refreshUserStats } from '@/entities/user-stats/server/refresh-user-stats'
import { GET } from '@/app/api/v1/users/[id]/stats/route'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const USER_ID = '64b7f0c2a1b2c3d4e5f60718'

const lean = (value: unknown) => ({ select: () => ({ lean: async () => value }), lean: async () => value })

beforeEach(() => {
  statsCache.get.mockReset()
  statsCache.set.mockReset()
  profileCache.get.mockReset()
})

describe('refreshUserStats', () => {
  beforeEach(() => {
    updateOne.mockReset()
  })

  it('upserts the summary guarded by the backup timestamp', async () => {
    updateOne.mockResolvedValue({})
    const backup = [makeCube({ allSolves: [makeSolve({ time: 9000 })] })]

    await refreshUserStats({ userId: USER_ID, backup, backupUpdatedAt: 500, timezone: 'Asia/Tokyo' })

    const [filter, update, options] = updateOne.mock.calls[0]
    expect(filter).toEqual({ user: USER_ID, backupUpdatedAt: { $lte: 500 } })
    expect(update.$set).toMatchObject({ version: USER_STATS_VERSION, backupUpdatedAt: 500 })
    expect(update.$set.summary).toMatchObject({ timezone: 'Asia/Tokyo', totalSolves: 1 })
    expect(options).toEqual({ upsert: true })
    expect(statsCache.set).toHaveBeenCalledWith(USER_ID, update.$set)
  })

  it('defaults to UTC without a timezone', async () => {
    updateOne.mockResolvedValue({})

    await refreshUserStats({ userId: USER_ID, backup: [], backupUpdatedAt: 1 })

    expect(updateOne.mock.calls[0][1].$set.summary.timezone).toBe('UTC')
  })

  it('ignores the duplicate key raised when a newer summary already exists', async () => {
    updateOne.mockRejectedValue(Object.assign(new Error('dup'), { code: 11000 }))

    await expect(refreshUserStats({ userId: USER_ID, backup: [], backupUpdatedAt: 1 })).resolves.toBeUndefined()
    expect(statsCache.set).not.toHaveBeenCalled()
  })

  it('rethrows other database errors', async () => {
    updateOne.mockRejectedValue(new Error('down'))

    await expect(refreshUserStats({ userId: USER_ID, backup: [], backupUpdatedAt: 1 })).rejects.toThrow('down')
  })

  it('rejects a backup that is not a cube list', async () => {
    await expect(refreshUserStats({ userId: USER_ID, backup: { nope: true }, backupUpdatedAt: 1 })).rejects.toThrow()
    expect(updateOne).not.toHaveBeenCalled()
  })
})

describe('GET /api/v1/users/[id]/stats', () => {
  const summary = { version: USER_STATS_VERSION, totalSolves: 3 }
  const call = async (id = USER_ID) => {
    const response = await GET({} as never, { params: Promise.resolve({ id }) })
    return response.json()
  }

  beforeEach(() => {
    auth.mockResolvedValue({ user: { id: 'viewer' } })
    ;(statsVisibleTo as Mock).mockResolvedValue(true)
    findById.mockReturnValue(lean({ backup: { updatedAt: 500 } }))
    findOne.mockReturnValue(lean({ version: USER_STATS_VERSION, backupUpdatedAt: 500, summary }))
  })

  it('returns the summary when it matches the current backup', async () => {
    expect(await call()).toEqual({ stats: summary })
    expect(statsVisibleTo).toHaveBeenCalledWith(USER_ID, 'viewer')
  })

  it('hides the summary from viewers without access and never reads it', async () => {
    ;(statsVisibleTo as Mock).mockResolvedValue(false)

    expect(await call()).toEqual({ stats: null, hidden: true })
    expect(findOne).not.toHaveBeenCalled()
    expect(statsCache.get).not.toHaveBeenCalled()
  })

  it('serves a fresh cached summary without reading Mongo', async () => {
    profileCache.get.mockResolvedValue({ backup: { updatedAt: 500 } })
    statsCache.get.mockResolvedValue({ version: USER_STATS_VERSION, backupUpdatedAt: 500, summary })

    expect(await call()).toEqual({ stats: summary })
    expect(findOne).not.toHaveBeenCalled()
    expect(findById).not.toHaveBeenCalled()
    expect(statsCache.set).not.toHaveBeenCalled()
  })

  it('skips a cached summary from an older backup and refills the cache from Mongo', async () => {
    profileCache.get.mockResolvedValue({ backup: { updatedAt: 500 } })
    statsCache.get.mockResolvedValue({ version: USER_STATS_VERSION, backupUpdatedAt: 400, summary: { stale: true } })

    expect(await call()).toEqual({ stats: summary })
    expect(statsCache.set).toHaveBeenCalledWith(USER_ID, { version: USER_STATS_VERSION, backupUpdatedAt: 500, summary })
  })

  it('reads the backup timestamp from Mongo when the profile is not cached', async () => {
    expect(await call()).toEqual({ stats: summary })
    expect(findById).toHaveBeenCalledWith(USER_ID)
    expect(statsCache.set).toHaveBeenCalledOnce()
  })

  it('returns null when the summary belongs to an older backup', async () => {
    findById.mockReturnValue(lean({ backup: { updatedAt: 900 } }))

    expect(await call()).toEqual({ stats: null })
    expect(statsCache.set).not.toHaveBeenCalled()
  })

  it('returns null when the summary was built by an older version', async () => {
    findOne.mockReturnValue(lean({ version: USER_STATS_VERSION - 1, backupUpdatedAt: 500, summary }))

    expect(await call()).toEqual({ stats: null })
  })

  it('returns null when there is no summary yet', async () => {
    findOne.mockReturnValue(lean(null))

    expect(await call()).toEqual({ stats: null })
  })

  it('returns null for a malformed id without touching the database', async () => {
    expect(await call('not-an-id')).toEqual({ stats: null })
    expect(findOne).not.toHaveBeenCalled()
  })
})

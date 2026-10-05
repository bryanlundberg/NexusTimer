const { updateOne, findOne, statsCache } = vi.hoisted(() => ({
  updateOne: vi.fn(),
  findOne: vi.fn(),
  statsCache: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() }
}))

vi.mock('@/entities/user-stats/model/user-stats', () => ({ default: { updateOne, findOne } }))
vi.mock('@/shared/config/mongodb/mongodb', () => ({ default: vi.fn(async () => true) }))
vi.mock('@/entities/user-stats/model/user-stats-cache', () => ({ userStatsCache: statsCache }))

import { refreshUserStats } from '@/entities/user-stats/server/refresh-user-stats'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const USER_ID = '64b7f0c2a1b2c3d4e5f60718'

beforeEach(() => {
  statsCache.get.mockReset()
  statsCache.set.mockReset()
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

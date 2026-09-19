const { userFind, userFindById, statsFind, refreshUserStats } = vi.hoisted(() => ({
  userFind: vi.fn(),
  userFindById: vi.fn(),
  statsFind: vi.fn(),
  refreshUserStats: vi.fn()
}))

vi.mock('@/entities/user/model/user', () => ({ default: { find: userFind, findById: userFindById } }))
vi.mock('@/entities/user-stats/model/user-stats', () => ({ default: { find: statsFind } }))
vi.mock('@/entities/user-stats/server/refresh-user-stats', () => ({ refreshUserStats }))

import { Types } from 'mongoose'
import { recomputeBatch, recomputeUser } from '@/entities/user-stats/server/recompute-user-stats'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'

const ids = Array.from({ length: 4 }, () => new Types.ObjectId())
const row = (id: Types.ObjectId, updatedAt = 100) => ({ _id: id, backup: { url: `https://b2/${id}`, updatedAt } })
const existing = (id: Types.ObjectId, backupUpdatedAt = 100, timezone = 'Asia/Tokyo') => ({
  user: id,
  version: USER_STATS_VERSION,
  backupUpdatedAt,
  summary: { timezone }
})

const chain = (value: unknown) => {
  const query = { sort: vi.fn(() => query), limit: vi.fn(() => query), lean: vi.fn(async () => value) }
  return query
}

beforeEach(() => {
  refreshUserStats.mockReset().mockResolvedValue(undefined)
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('[]', { status: 200 }))
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('recomputeBatch', () => {
  it('rebuilds stale summaries, skips fresh ones and keeps the stored timezone', async () => {
    userFind.mockReturnValue(chain([row(ids[0], 200), row(ids[1], 100)]))
    statsFind.mockReturnValue(chain([existing(ids[0], 100), existing(ids[1], 100)]))

    const result = await recomputeBatch({ limit: 20, force: false })

    expect(result).toEqual({ processed: 2, rebuilt: 1, fresh: 1, failed: [], nextCursor: null })
    expect(refreshUserStats).toHaveBeenCalledOnce()
    expect(refreshUserStats).toHaveBeenCalledWith({
      userId: String(ids[0]),
      backup: [],
      backupUpdatedAt: 200,
      timezone: 'Asia/Tokyo'
    })
  })

  it('rebuilds fresh summaries too when forced', async () => {
    userFind.mockReturnValue(chain([row(ids[0]), row(ids[1])]))
    statsFind.mockReturnValue(chain([existing(ids[0]), existing(ids[1])]))

    const result = await recomputeBatch({ limit: 20, force: true })

    expect(result.rebuilt).toBe(2)
    expect(refreshUserStats).toHaveBeenCalledTimes(2)
  })

  it('pages by id after the cursor and returns the next one while pages are full', async () => {
    const query = chain([row(ids[0]), row(ids[1])])
    userFind.mockReturnValue(query)
    statsFind.mockReturnValue(chain([]))

    const result = await recomputeBatch({ cursor: String(ids[3]), limit: 2, force: false })

    expect(result.nextCursor).toBe(String(ids[1]))
    expect(userFind.mock.calls[0][0]).toEqual({
      'backup.url': { $exists: true, $ne: null },
      _id: { $gt: ids[3] }
    })
    expect(query.sort).toHaveBeenCalledWith({ _id: 1 })
    expect(query.limit).toHaveBeenCalledWith(2)
  })

  it('reports per user failures without stopping the batch', async () => {
    userFind.mockReturnValue(chain([row(ids[0]), row(ids[1])]))
    statsFind.mockReturnValue(chain([]))
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith(String(ids[0])) ? new Response('gone', { status: 404 }) : new Response('[]', { status: 200 })
      )
    )

    const result = await recomputeBatch({ limit: 20, force: false })

    expect(result.rebuilt).toBe(1)
    expect(result.failed).toEqual([{ userId: String(ids[0]), error: 'Backup download failed: HTTP 404' }])
  })
})

describe('recomputeUser', () => {
  it('always rebuilds, even an up to date summary', async () => {
    userFindById.mockReturnValue(chain(row(ids[2])))
    statsFind.mockReturnValue(chain([existing(ids[2])]))

    expect(await recomputeUser(String(ids[2]))).toBe('rebuilt')
    expect(refreshUserStats).toHaveBeenCalledOnce()
  })

  it('reports a user without a backup', async () => {
    userFindById.mockReturnValue(chain({ _id: ids[2] }))
    statsFind.mockReturnValue(chain([]))

    expect(await recomputeUser(String(ids[2]))).toBe('no-backup')
    expect(refreshUserStats).not.toHaveBeenCalled()
  })

  it('returns null for an unknown user', async () => {
    userFindById.mockReturnValue(chain(null))

    expect(await recomputeUser(String(ids[2]))).toBeNull()
  })
})

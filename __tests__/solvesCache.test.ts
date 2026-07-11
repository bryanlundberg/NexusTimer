import { vi } from 'vitest'
import { solvesCache, SOLVES_FIRST_PAGE_SIZE } from '@/entities/trainer-solve/model/solves-cache'
import { getRedis } from '@/shared/config/redis/redis'

const multiMock = {
  del: vi.fn().mockReturnThis(),
  rPush: vi.fn().mockReturnThis(),
  lPush: vi.fn().mockReturnThis(),
  lTrim: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue([])
}

const redisMock = {
  lRange: vi.fn(),
  exists: vi.fn(),
  del: vi.fn(),
  multi: vi.fn(() => multiMock)
}

vi.mock('@/shared/config/redis/redis', () => ({
  getRedis: vi.fn()
}))

const getRedisMock = vi.mocked(getRedis)

const USER = 'user-1'
const METHOD = 'pll'
const KEY = `trainer:solves:${USER}:${METHOD}`
const SENTINEL = '__end__'

const solve = (id: string) => ({ _id: id, methodSlug: METHOD, caseId: 'case-a', timeMs: 1000, penalty: 'OK' })

describe('solvesCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getRedisMock.mockResolvedValue(redisMock as never)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getFirstPage', () => {
    it('returns null on miss (empty list)', async () => {
      redisMock.lRange.mockResolvedValue([])
      expect(await solvesCache.getFirstPage(USER, METHOD, 12)).toBeNull()
      expect(redisMock.lRange).toHaveBeenCalledWith(KEY, 0, -1)
    })

    it('returns null when limit exceeds the cache window', async () => {
      expect(await solvesCache.getFirstPage(USER, METHOD, SOLVES_FIRST_PAGE_SIZE + 1)).toBeNull()
      expect(redisMock.lRange).not.toHaveBeenCalled()
    })

    it('serves a complete history (sentinel present) even when shorter than limit', async () => {
      redisMock.lRange.mockResolvedValue([JSON.stringify(solve('b')), JSON.stringify(solve('a')), SENTINEL])
      expect(await solvesCache.getFirstPage(USER, METHOD, 12)).toEqual([solve('b'), solve('a')])
    })

    it('slices to the requested limit', async () => {
      redisMock.lRange.mockResolvedValue([
        JSON.stringify(solve('c')),
        JSON.stringify(solve('b')),
        JSON.stringify(solve('a')),
        SENTINEL
      ])
      expect(await solvesCache.getFirstPage(USER, METHOD, 2)).toEqual([solve('c'), solve('b')])
    })

    it('returns null for a partial window shorter than the limit', async () => {
      redisMock.lRange.mockResolvedValue([JSON.stringify(solve('a'))]) // no sentinel
      expect(await solvesCache.getFirstPage(USER, METHOD, 12)).toBeNull()
    })

    it('serves a partial window when it is long enough', async () => {
      redisMock.lRange.mockResolvedValue([JSON.stringify(solve('b')), JSON.stringify(solve('a'))])
      expect(await solvesCache.getFirstPage(USER, METHOD, 2)).toEqual([solve('b'), solve('a')])
    })

    it('returns null when Redis is down', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      expect(await solvesCache.getFirstPage(USER, METHOD, 12)).toBeNull()
    })
  })

  describe('prime', () => {
    it('stores solves with sentinel when the history is complete', async () => {
      await solvesCache.prime(USER, METHOD, [solve('b'), solve('a')], true)

      expect(multiMock.del).toHaveBeenCalledWith(KEY)
      expect(multiMock.rPush).toHaveBeenCalledWith(KEY, [
        JSON.stringify(solve('b')),
        JSON.stringify(solve('a')),
        SENTINEL
      ])
      expect(multiMock.exec).toHaveBeenCalled()
    })

    it('stores solves without sentinel for a partial window', async () => {
      await solvesCache.prime(USER, METHOD, [solve('a')], false)
      expect(multiMock.rPush).toHaveBeenCalledWith(KEY, [JSON.stringify(solve('a'))])
    })

    it('caches an empty complete history as sentinel only', async () => {
      await solvesCache.prime(USER, METHOD, [], true)
      expect(multiMock.rPush).toHaveBeenCalledWith(KEY, [SENTINEL])
    })

    it('swallows Redis failures', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(solvesCache.prime(USER, METHOD, [solve('a')], true)).resolves.toBeUndefined()
    })
  })

  describe('push', () => {
    it('does nothing when the list is not cached', async () => {
      redisMock.exists.mockResolvedValue(0)
      await solvesCache.push(USER, METHOD, solve('a'))
      expect(multiMock.lPush).not.toHaveBeenCalled()
    })

    it('prepends and trims when cached', async () => {
      redisMock.exists.mockResolvedValue(1)
      await solvesCache.push(USER, METHOD, solve('a'))

      expect(multiMock.lPush).toHaveBeenCalledWith(KEY, JSON.stringify(solve('a')))
      expect(multiMock.lTrim).toHaveBeenCalledWith(KEY, 0, SOLVES_FIRST_PAGE_SIZE)
      expect(multiMock.exec).toHaveBeenCalled()
    })

    it('invalidates the key if the write-through fails', async () => {
      redisMock.exists.mockResolvedValue(1)
      multiMock.exec.mockRejectedValueOnce(new Error('write failed'))

      await solvesCache.push(USER, METHOD, solve('a'))
      expect(redisMock.del).toHaveBeenCalledWith(KEY)
    })
  })

  describe('invalidate', () => {
    it('deletes the key and swallows failures', async () => {
      await solvesCache.invalidate(USER, METHOD)
      expect(redisMock.del).toHaveBeenCalledWith(KEY)

      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(solvesCache.invalidate(USER, METHOD)).resolves.toBeUndefined()
    })
  })
})

import { vi } from 'vitest'
import { learnedCache } from '@/entities/trainer-learned/model/learned-cache'
import { getRedis } from '@/shared/config/redis/redis'

const multiMock = {
  del: vi.fn().mockReturnThis(),
  sAdd: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue([])
}

const redisMock = {
  sMembers: vi.fn(),
  sIsMember: vi.fn(),
  sAdd: vi.fn(),
  sRem: vi.fn(),
  del: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  multi: vi.fn(() => multiMock)
}

vi.mock('@/shared/config/redis/redis', () => ({
  getRedis: vi.fn()
}))

const getRedisMock = vi.mocked(getRedis)

const USER = 'user-1'
const METHOD = 'pll'
const KEY = `trainer:learned:${USER}:${METHOD}`
const SENTINEL = '__init__'

describe('learnedCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getRedisMock.mockResolvedValue(redisMock as never)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('get', () => {
    it('returns null on cache miss (no sentinel)', async () => {
      redisMock.sMembers.mockResolvedValue([])
      expect(await learnedCache.get(USER, METHOD)).toBeNull()
      expect(redisMock.sMembers).toHaveBeenCalledWith(KEY)
    })

    it('treats a partial set without sentinel as a miss', async () => {
      redisMock.sMembers.mockResolvedValue(['case-a'])
      expect(await learnedCache.get(USER, METHOD)).toBeNull()
    })

    it('returns caseIds without the sentinel on hit', async () => {
      redisMock.sMembers.mockResolvedValue([SENTINEL, 'case-a', 'case-b'])
      expect(await learnedCache.get(USER, METHOD)).toEqual(['case-a', 'case-b'])
    })

    it('returns empty array for a cached empty set', async () => {
      redisMock.sMembers.mockResolvedValue([SENTINEL])
      expect(await learnedCache.get(USER, METHOD)).toEqual([])
    })

    it('returns null when Redis is down', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      expect(await learnedCache.get(USER, METHOD)).toBeNull()
    })
  })

  describe('prime', () => {
    it('replaces the set atomically with sentinel + caseIds', async () => {
      await learnedCache.prime(USER, METHOD, ['case-a', 'case-b'])

      expect(multiMock.del).toHaveBeenCalledWith(KEY)
      expect(multiMock.sAdd).toHaveBeenCalledWith(KEY, [SENTINEL, 'case-a', 'case-b'])
      expect(multiMock.exec).toHaveBeenCalled()
    })

    it('swallows Redis failures', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(learnedCache.prime(USER, METHOD, ['case-a'])).resolves.toBeUndefined()
    })
  })

  describe('setLearned', () => {
    it('does nothing when the set is not cached', async () => {
      redisMock.sIsMember.mockResolvedValue(false)
      await learnedCache.setLearned(USER, METHOD, 'case-a', true)

      expect(redisMock.sAdd).not.toHaveBeenCalled()
      expect(redisMock.sRem).not.toHaveBeenCalled()
    })

    it('adds the caseId when learned=true and cached', async () => {
      redisMock.sIsMember.mockResolvedValue(true)
      await learnedCache.setLearned(USER, METHOD, 'case-a', true)

      expect(redisMock.sIsMember).toHaveBeenCalledWith(KEY, SENTINEL)
      expect(redisMock.sAdd).toHaveBeenCalledWith(KEY, 'case-a')
    })

    it('removes the caseId when learned=false and cached', async () => {
      redisMock.sIsMember.mockResolvedValue(true)
      await learnedCache.setLearned(USER, METHOD, 'case-a', false)

      expect(redisMock.sRem).toHaveBeenCalledWith(KEY, 'case-a')
    })

    it('invalidates the key if the write-through fails', async () => {
      redisMock.sIsMember.mockResolvedValue(true)
      redisMock.sAdd.mockRejectedValue(new Error('write failed'))

      await learnedCache.setLearned(USER, METHOD, 'case-a', true)

      expect(redisMock.del).toHaveBeenCalledWith(KEY)
    })
  })

  describe('summary', () => {
    const SUMMARY_KEY = `trainer:learned-summary:${USER}`
    const summary = { total: 2, methods: [{ methodSlug: METHOD, count: 2, caseIds: ['case-a', 'case-b'] }] }

    it('getSummary returns null on miss and parsed JSON on hit', async () => {
      redisMock.get.mockResolvedValue(null)
      expect(await learnedCache.getSummary(USER)).toBeNull()

      redisMock.get.mockResolvedValue(JSON.stringify(summary))
      expect(await learnedCache.getSummary(USER)).toEqual(summary)
      expect(redisMock.get).toHaveBeenCalledWith(SUMMARY_KEY)
    })

    it('getSummary returns null when Redis is down', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      expect(await learnedCache.getSummary(USER)).toBeNull()
    })

    it('primeSummary stores the JSON and swallows failures', async () => {
      await learnedCache.primeSummary(USER, summary)
      expect(redisMock.set).toHaveBeenCalledWith(SUMMARY_KEY, JSON.stringify(summary))

      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(learnedCache.primeSummary(USER, summary)).resolves.toBeUndefined()
    })

    it('invalidateSummary deletes the key and swallows failures', async () => {
      await learnedCache.invalidateSummary(USER)
      expect(redisMock.del).toHaveBeenCalledWith(SUMMARY_KEY)

      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(learnedCache.invalidateSummary(USER)).resolves.toBeUndefined()
    })
  })

  describe('invalidate', () => {
    it('deletes the key and swallows failures', async () => {
      await learnedCache.invalidate(USER, METHOD)
      expect(redisMock.del).toHaveBeenCalledWith(KEY)

      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(learnedCache.invalidate(USER, METHOD)).resolves.toBeUndefined()
    })
  })
})

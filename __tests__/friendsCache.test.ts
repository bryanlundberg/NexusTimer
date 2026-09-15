import { vi } from 'vitest'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import { getRedis } from '@/shared/config/redis/redis'

const multiMock = {
  del: vi.fn().mockReturnThis(),
  sAdd: vi.fn().mockReturnThis(),
  expire: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue([])
}

const redisMock = {
  sMembers: vi.fn(),
  del: vi.fn(),
  multi: vi.fn(() => multiMock)
}

vi.mock('@/shared/config/redis/redis', () => ({
  getRedis: vi.fn()
}))

const getRedisMock = vi.mocked(getRedis)

const USER = 'user-1'
const KEY = `friends:${USER}`
const SENTINEL = '__init__'

describe('friendsCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getRedisMock.mockResolvedValue(redisMock as never)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('get', () => {
    it('returns null on cache miss (no sentinel)', async () => {
      redisMock.sMembers.mockResolvedValue([])
      expect(await friendsCache.get(USER)).toBeNull()
      expect(redisMock.sMembers).toHaveBeenCalledWith(KEY)
    })

    it('returns friend ids without the sentinel on hit', async () => {
      redisMock.sMembers.mockResolvedValue([SENTINEL, 'a', 'b'])
      expect(await friendsCache.get(USER)).toEqual(['a', 'b'])
    })

    it('returns an empty array for a user cached with no friends', async () => {
      redisMock.sMembers.mockResolvedValue([SENTINEL])
      expect(await friendsCache.get(USER)).toEqual([])
    })

    it('returns null when Redis is unavailable', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      expect(await friendsCache.get(USER)).toBeNull()
    })
  })

  describe('prime', () => {
    it('replaces the set with the sentinel plus ids and sets a TTL', async () => {
      await friendsCache.prime(USER, ['a', 'b'])
      expect(multiMock.del).toHaveBeenCalledWith(KEY)
      expect(multiMock.sAdd).toHaveBeenCalledWith(KEY, [SENTINEL, 'a', 'b'])
      expect(multiMock.expire).toHaveBeenCalledWith(KEY, expect.any(Number))
      expect(multiMock.exec).toHaveBeenCalled()
    })

    it('swallows Redis failures', async () => {
      getRedisMock.mockRejectedValue(new Error('down'))
      await expect(friendsCache.prime(USER, ['a'])).resolves.toBeUndefined()
    })
  })

  describe('invalidate', () => {
    it('deletes every given user key in one call', async () => {
      await friendsCache.invalidate('a', 'b')
      expect(redisMock.del).toHaveBeenCalledWith(['friends:a', 'friends:b'])
    })
  })
})

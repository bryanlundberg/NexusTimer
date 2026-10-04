import { describe, expect, it } from 'vitest'
import { createFriendsCache } from '../src/modules/social/friends.cache'
import { createSocialService } from '../src/modules/social/social.service'
import { fakeRedis } from './fake-redis'

describe('social service', () => {
  it('loads friend ids once, caches them and answers friendship from the cache', async () => {
    const redis = fakeRedis()
    let reads = 0
    const service = createSocialService({
      blocks: { blockState: async () => 'none', blockedEitherWay: async () => [] },
      friends: {
        async acceptedFriendIds() {
          reads++
          return ['f1', 'f2']
        }
      },
      friendsCache: createFriendsCache(redis.provider)
    })

    expect((await service.friendIds('u1')).sort()).toEqual(['f1', 'f2'])
    expect(await service.areFriends('u1', 'f2')).toBe(true)
    expect(await service.areFriends('u1', 'stranger')).toBe(false)
    expect(reads).toBe(1)
  })

  it('caches an empty friend list too', async () => {
    const redis = fakeRedis()
    let reads = 0
    const service = createSocialService({
      blocks: { blockState: async () => 'none', blockedEitherWay: async () => [] },
      friends: {
        async acceptedFriendIds() {
          reads++
          return []
        }
      },
      friendsCache: createFriendsCache(redis.provider)
    })

    await service.friendIds('u1')
    await service.friendIds('u1')

    expect(reads).toBe(1)
  })
})

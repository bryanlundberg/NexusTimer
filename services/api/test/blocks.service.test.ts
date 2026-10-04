import { describe, expect, it } from 'vitest'
import { createRealtimePublisher } from '../src/infra/realtime'
import type { BlocksRepository, StoredBlock } from '../src/modules/social/blocks.repository'
import { createBlocksService } from '../src/modules/social/blocks.service'
import { createFriendsCache } from '../src/modules/social/friends.cache'
import { fakeRedis } from './fake-redis'
import { fakeFriendships, fakeUsers } from './social-fakes'

function setup() {
  const redis = fakeRedis()
  const friendships = fakeFriendships()
  const blocks = new Map<string, StoredBlock[]>()

  const repository: Pick<BlocksRepository, 'listBlockedBy' | 'block' | 'unblock'> = {
    async listBlockedBy(blockerId, limit) {
      return (blocks.get(blockerId) ?? []).slice(0, limit)
    },
    async block(blockerId, blockedId) {
      const mine = blocks.get(blockerId) ?? []
      if (!mine.some((block) => block.blockedId === blockedId)) {
        blocks.set(blockerId, [{ blockedId, createdAt: new Date('2026-10-04T10:00:00.000Z') }, ...mine])
      }
    },
    async unblock(blockerId, blockedId) {
      const mine = blocks.get(blockerId) ?? []
      blocks.set(
        blockerId,
        mine.filter((block) => block.blockedId !== blockedId)
      )
      return mine.some((block) => block.blockedId === blockedId)
    }
  }

  const service = createBlocksService({
    repository,
    friendships: friendships.repository,
    friendsCache: createFriendsCache(redis.provider),
    users: fakeUsers(),
    realtime: createRealtimePublisher(redis.provider)
  })
  const events = () =>
    redis.published.splice(0).map(({ channel, message }) => [channel.replace('rt:user:', ''), JSON.parse(message)])

  return { service, redis, friendships, blocks, events }
}

describe('blocks service', () => {
  it('refuses unknown users', async () => {
    const { service, blocks, events } = setup()

    expect(await service.block('ana', 'nobody')).toBe('not-found')
    expect(blocks.size).toBe(0)
    expect(events()).toEqual([])
  })

  it('ends a friendship, drops both friend caches and tells both sides', async () => {
    const { service, redis, friendships, events } = setup()
    friendships.befriend('ana', 'ben')
    redis.sets.set('friends:ana', new Set(['__init__', 'ben']))
    redis.sets.set('friends:ben', new Set(['__init__', 'ana']))

    expect(await service.block('ana', 'ben')).toBe('blocked')

    expect(friendships.docs.size).toBe(0)
    expect(redis.sets.size).toBe(0)
    expect(events()).toEqual([
      ['ana', { type: 'friend:removed', userId: 'ben' }],
      ['ben', { type: 'friend:removed', userId: 'ana' }]
    ])
  })

  it('removes a pending request without touching the friend caches', async () => {
    const { service, redis, friendships } = setup()
    await friendships.repository.createRequest('ben', 'ana')
    redis.sets.set('friends:ana', new Set(['__init__']))

    await service.block('ana', 'ben')

    expect(friendships.docs.size).toBe(0)
    expect(redis.sets.has('friends:ana')).toBe(true)
  })

  it('lists blocked users with their card and skips deleted ones', async () => {
    const { service, blocks } = setup()
    await service.block('ana', 'ben')
    await service.block('ana', 'cam')
    blocks.get('ana')!.push({ blockedId: 'ghost', createdAt: new Date() })

    expect(await service.list('ana')).toEqual({
      blocked: [
        { user: { _id: 'cam', name: 'Cam', image: '' }, since: '2026-10-04T10:00:00.000Z' },
        { user: { _id: 'ben', name: 'Ben', image: 'https://cdn.test/b.png' }, since: '2026-10-04T10:00:00.000Z' }
      ]
    })
  })

  it('tells only the unblocker, and only when a block was removed', async () => {
    const { service, events } = setup()
    await service.block('ana', 'ben')
    events()

    await service.unblock('ana', 'ben')
    await service.unblock('ana', 'ben')

    expect(events()).toEqual([['ana', { type: 'friend:removed', userId: 'ben' }]])
  })
})

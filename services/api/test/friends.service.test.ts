import type { PrivacySettings } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import type { Mail } from '../src/infra/mail'
import { createRealtimePublisher } from '../src/infra/realtime'
import { pairKeyOf } from '../src/lib/pair-key'
import type { BlockState } from '../src/modules/social/blocks.repository'
import { createFriendRequestLimits } from '../src/modules/social/friend-requests.limits'
import { createFriendsCache } from '../src/modules/social/friends.cache'
import { createFriendsService } from '../src/modules/social/friends.service'
import { createSocialService } from '../src/modules/social/social.service'
import { fakeRedis } from './fake-redis'
import { fakeFriendships, fakeUsers } from './social-fakes'

function setup({
  privacy = {},
  blocks = {}
}: { privacy?: Record<string, Partial<PrivacySettings>>; blocks?: Record<string, BlockState> } = {}) {
  const redis = fakeRedis()
  const friendships = fakeFriendships()
  const friendsCache = createFriendsCache(redis.provider)
  const social = createSocialService({
    blocks: {
      blockState: async (userId, otherId) => blocks[`${userId}>${otherId}`] ?? 'none',
      blockedEitherWay: async () => []
    },
    friends: friendships.repository,
    friendsCache
  })
  const sent: Mail[] = []
  const tasks: Promise<unknown>[] = []

  const service = createFriendsService({
    repository: friendships.repository,
    cache: friendsCache,
    limits: createFriendRequestLimits(redis.provider),
    social,
    users: fakeUsers(privacy),
    realtime: createRealtimePublisher(redis.provider),
    mail: async (mail) => {
      sent.push(mail)
    },
    appUrl: 'https://beta.nexustimer.com',
    background: (_scope, task) => {
      tasks.push(task())
    }
  })

  const events = () =>
    redis.published.splice(0).map(({ channel, message }) => [channel.replace('rt:user:', ''), JSON.parse(message)])
  const settle = () => Promise.all(tasks.splice(0))

  return { service, social, redis, friendships, sent, events, settle }
}

describe('friends service', () => {
  it('sends a request, tells both sides and emails the recipient once per pair', async () => {
    const { service, sent, events, settle } = setup()

    expect(await service.request('ana', 'ben')).toEqual({ status: 'pending_out' })
    await settle()
    expect(events()).toEqual([
      ['ana', { type: 'friend:request', userId: 'ben' }],
      ['ben', { type: 'friend:request', userId: 'ana' }]
    ])
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({ to: 'ben@test.dev', subject: 'Ana <3 wants to add you as a friend on Nexus Timer' })
    expect(sent[0]!.html).toContain('Ana &lt;3')
    expect(sent[0]!.html).toContain('https://beta.nexustimer.com/a.png')
    expect(sent[0]!.html).toContain('https://beta.nexustimer.com/people/ana')

    await service.remove('ana', 'ben')
    expect(await service.request('ben', 'ana')).toEqual({ status: 'pending_out' })
    await settle()
    expect(sent).toHaveLength(1)
  })

  it('skips the email when the recipient turned it off or has no address', async () => {
    const off = setup({ privacy: { ben: { friendRequestEmails: false } } })
    await off.service.request('ana', 'ben')
    await off.settle()

    const noAddress = setup()
    await noAddress.service.request('ana', 'dan')
    await noAddress.settle()

    expect(off.sent).toEqual([])
    expect(noAddress.sent).toEqual([])
  })

  it('accepts when the other side asks back and drops both friend caches', async () => {
    const { service, social, redis, events } = setup()
    await service.request('ana', 'ben')
    await social.friendIds('ana')
    await social.friendIds('ben')
    events()

    expect(await service.request('ben', 'ana')).toEqual({ status: 'friends' })
    expect(redis.sets.has('friends:ana')).toBe(false)
    expect(redis.sets.has('friends:ben')).toBe(false)
    expect(events()).toEqual([
      ['ben', { type: 'friend:accepted', userId: 'ana' }],
      ['ana', { type: 'friend:accepted', userId: 'ben' }]
    ])
    expect(await social.areFriends('ana', 'ben')).toBe(true)
  })

  it('answers the current status without side effects when nothing changes', async () => {
    const { service, friendships, events } = setup()
    friendships.befriend('ana', 'ben')

    expect(await service.request('ana', 'ben')).toEqual({ status: 'friends' })
    expect(events()).toEqual([])
  })

  it('keeps a declined request pending for the requester and silent for the decliner', async () => {
    const { service, events } = setup()
    await service.request('ana', 'ben')
    events()

    await service.remove('ben', 'ana')

    expect(events()).toEqual([['ben', { type: 'friend:removed', userId: 'ana' }]])
    expect((await service.relationship('ana', 'ben')).status).toBe('pending_out')
    expect((await service.relationship('ben', 'ana')).status).toBe('none')
    expect((await service.list('ana')).outgoing.map((entry) => entry.user._id)).toEqual(['ben'])
    expect(await service.list('ben')).toEqual({ friends: [], incoming: [], outgoing: [] })
    expect(await service.request('ana', 'ben')).toEqual({ status: 'pending_out' })
    expect(events()).toEqual([])
  })

  it('lets the decliner change their mind by asking back', async () => {
    const { service } = setup()
    await service.request('ana', 'ben')
    await service.remove('ben', 'ana')

    expect(await service.request('ben', 'ana')).toEqual({ status: 'friends' })
  })

  it('starts fresh after the requester withdraws a declined request', async () => {
    const { service, friendships } = setup()
    await service.request('ana', 'ben')
    await service.remove('ben', 'ana')
    await service.remove('ana', 'ben')

    expect((await service.relationship('ana', 'ben')).status).toBe('none')
    expect(await service.request('ben', 'ana')).toEqual({ status: 'pending_out' })
    expect(friendships.docs.get(pairKeyOf('ana', 'ben'))).toMatchObject({ requesterId: 'ben', status: 'pending' })
    expect((await service.relationship('ana', 'ben')).status).toBe('pending_in')
  })

  it('puts a cancelled request on cooldown', async () => {
    const { service, events } = setup()
    await service.request('ana', 'ben')
    events()

    await service.remove('ana', 'ben')

    expect(events()).toEqual([
      ['ana', { type: 'friend:removed', userId: 'ben' }],
      ['ben', { type: 'friend:removed', userId: 'ana' }]
    ])
    expect(await service.request('ana', 'ben')).toEqual({ error: 'request-cooldown' })
  })

  it('stops at the daily limit', async () => {
    const { service, redis } = setup()
    redis.strings.set('friend-requests:daily:ana', '30')

    expect(await service.request('ana', 'ben')).toEqual({ error: 'request-limit' })
  })

  it('refuses unknown users, blocks either way and closed requests', async () => {
    const blocked = setup({ blocks: { 'ana>ben': 'blocked', 'ana>cam': 'blocked_by' } })
    expect(await blocked.service.request('ana', 'nobody')).toEqual({ error: 'not-found' })
    expect(await blocked.service.request('ana', 'ben')).toEqual({ error: 'blocked' })
    expect(await blocked.service.request('ana', 'cam')).toEqual({ error: 'requests-closed' })

    const closed = setup({
      privacy: { ben: { friendRequests: 'nobody' }, cam: { friendRequests: 'friends_of_friends' } }
    })
    expect(await closed.service.request('ana', 'ben')).toEqual({ error: 'requests-closed' })
    expect(await closed.service.request('ana', 'cam')).toEqual({ error: 'requests-closed' })

    const mutual = setup({ privacy: { cam: { friendRequests: 'friends_of_friends' } } })
    mutual.friendships.befriend('ana', 'dan')
    mutual.friendships.befriend('cam', 'dan')
    expect(await mutual.service.request('ana', 'cam')).toEqual({ status: 'pending_out' })
  })

  it('removes a friend for both and drops their caches', async () => {
    const { service, social, friendships, redis, events } = setup()
    friendships.befriend('ana', 'ben')
    expect(await social.areFriends('ana', 'ben')).toBe(true)

    await service.remove('ana', 'ben')

    expect(redis.sets.has('friends:ana')).toBe(false)
    expect(await social.areFriends('ana', 'ben')).toBe(false)
    expect(events()).toEqual([
      ['ana', { type: 'friend:removed', userId: 'ben' }],
      ['ben', { type: 'friend:removed', userId: 'ana' }]
    ])
  })

  it('describes a relationship with mutual friends in friend order', async () => {
    const { service, friendships } = setup({ privacy: { ben: { friendRequests: 'friends_of_friends' } } })
    for (const mutual of ['cam', 'dan', 'eve', 'fay']) {
      friendships.befriend('ana', mutual)
      friendships.befriend('ben', mutual)
    }

    expect(await service.relationship('ana', 'ben')).toEqual({
      status: 'none',
      canRequest: true,
      mutual: {
        count: 4,
        users: [
          { _id: 'cam', name: 'Cam', image: '' },
          { _id: 'dan', name: 'Dan', image: '' },
          { _id: 'eve', name: 'Eve', image: '' }
        ]
      }
    })
  })

  it('reports a block of mine as blocked and never offers a request across a block', async () => {
    const { service } = setup({ blocks: { 'ana>ben': 'blocked', 'ana>cam': 'blocked_by' } })

    expect(await service.relationship('ana', 'ben')).toMatchObject({ status: 'blocked', canRequest: false })
    expect(await service.relationship('ana', 'cam')).toMatchObject({ status: 'none', canRequest: false })
  })

  it('lists friends, incoming and outgoing with profile fields and skips deleted users', async () => {
    const { service, friendships } = setup()
    friendships.befriend('ana', 'ben')
    await service.request('cam', 'ana')
    await service.request('ana', 'dan')
    friendships.docs.set(pairKeyOf('ana', 'ghost'), {
      id: 'ghost',
      users: ['ana', 'ghost'],
      requesterId: 'ana',
      status: 'pending',
      createdAt: new Date()
    })

    const list = await service.list('ana')

    expect(list.friends).toEqual([
      {
        user: { _id: 'ben', name: 'Ben', image: 'https://cdn.test/b.png', method: 'CFOP' },
        since: '2026-01-01T00:00:01.000Z'
      }
    ])
    expect(list.incoming.map((entry) => entry.user._id)).toEqual(['cam'])
    expect(list.outgoing).toEqual([{ user: { _id: 'dan', name: 'Dan', image: '' }, since: expect.any(String) }])
  })
})

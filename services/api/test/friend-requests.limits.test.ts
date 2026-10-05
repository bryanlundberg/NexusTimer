import { describe, expect, it, vi } from 'vitest'
import { createFriendRequestLimits } from '../src/modules/social/friend-requests.limits'
import { fakeRedis } from './fake-redis'

describe('friend request limits', () => {
  it('keeps a one day cooldown per direction', async () => {
    const redis = fakeRedis()
    const limits = createFriendRequestLimits(redis.provider)

    await limits.startCooldown('ana', 'ben')

    expect(await limits.onCooldown('ana', 'ben')).toBe(true)
    expect(await limits.onCooldown('ben', 'ana')).toBe(false)
    expect(redis.ttls.get('friend-requests:cooldown:ana:ben')).toBe(86_400)
  })

  it('allows 30 requests a day and starts the window on the first one', async () => {
    const redis = fakeRedis()
    const limits = createFriendRequestLimits(redis.provider)

    const results = []
    for (let i = 0; i < 31; i++) results.push(await limits.consumeDaily('ana'))

    expect(results.filter(Boolean)).toHaveLength(30)
    expect(results.at(-1)).toBe(false)
    expect(redis.ttls.get('friend-requests:daily:ana')).toBe(86_400)
  })

  it('fails open when Redis is down', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const redis = fakeRedis()
    redis.state.down = true
    const limits = createFriendRequestLimits(redis.provider)

    expect(await limits.onCooldown('ana', 'ben')).toBe(false)
    expect(await limits.consumeDaily('ana')).toBe(true)
    await expect(limits.startCooldown('ana', 'ben')).resolves.toBeUndefined()
  })
})

import { describe, expect, it, vi } from 'vitest'
import type { BlocksService } from '../src/modules/social/blocks.service'
import type { FriendsService } from '../src/modules/social/friends.service'
import { buildTestApp, testSessions } from './helpers'

const ME = '64b7f0c2a1b2c3d4e5f60718'
const OTHER = '64b7f0c2a1b2c3d4e5f60719'

const json = (method: string, body: unknown) => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

const unused = () => Promise.reject(new Error('not used'))

function appWith(
  { friends = {}, blocks = {} }: { friends?: Partial<FriendsService>; blocks?: Partial<BlocksService> },
  userId: string | null = ME
) {
  return buildTestApp({
    sessions: testSessions(userId),
    friends: { list: unused, relationship: unused, request: unused, remove: unused, ...friends },
    blocks: { list: unused, block: unused, unblock: unused, ...blocks }
  })
}

describe('friends routes', () => {
  it('answers 401 without a session', async () => {
    const app = appWith({}, null)

    for (const [path, init] of [
      ['/api/v1/friends', undefined],
      ['/api/v1/friends', json('POST', { userId: OTHER })],
      [`/api/v1/friends/${OTHER}`, undefined],
      [`/api/v1/friends/${OTHER}`, { method: 'DELETE' }]
    ] as const) {
      const res = await app.request(path, init)
      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ message: 'Unauthorized' })
    }
  })

  it('returns the friends list', async () => {
    const list = vi.fn<FriendsService['list']>(() => Promise.resolve({ friends: [], incoming: [], outgoing: [] }))

    const res = await appWith({ friends: { list } }).request('/api/v1/friends')

    expect(await res.json()).toEqual({ friends: [], incoming: [], outgoing: [] })
    expect(list).toHaveBeenCalledWith(ME)
  })

  it('validates the request body and refuses adding yourself', async () => {
    const request = vi.fn<FriendsService['request']>()
    const app = appWith({ friends: { request } })

    const invalid = await app.request('/api/v1/friends', json('POST', { userId: 'nope' }))
    const extra = await app.request('/api/v1/friends', json('POST', { userId: OTHER, note: 'hi' }))
    const self = await app.request('/api/v1/friends', json('POST', { userId: ME }))

    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toMatchObject({ message: 'Invalid request', issues: [{ path: ['userId'] }] })
    expect(extra.status).toBe(400)
    expect(self.status).toBe(400)
    expect(await self.json()).toEqual({ message: 'Cannot add yourself' })
    expect(request).not.toHaveBeenCalled()
  })

  it('maps request outcomes to the v1 statuses and messages', async () => {
    const cases = [
      [{ status: 'pending_out' }, 200, { status: 'pending_out' }],
      [{ status: 'friends' }, 200, { status: 'friends' }],
      [{ error: 'not-found' }, 404, { message: 'User not found' }],
      [{ error: 'blocked' }, 403, { message: 'blocked' }],
      [{ error: 'requests-closed' }, 403, { message: 'requests-closed' }],
      [{ error: 'request-cooldown' }, 429, { message: 'request-cooldown' }],
      [{ error: 'request-limit' }, 429, { message: 'request-limit' }]
    ] as const

    for (const [result, status, body] of cases) {
      const request = vi.fn<FriendsService['request']>(() => Promise.resolve(result))
      const res = await appWith({ friends: { request } }).request('/api/v1/friends', json('POST', { userId: OTHER }))

      expect(res.status).toBe(status)
      expect(await res.json()).toEqual(body)
      expect(request).toHaveBeenCalledWith(ME, OTHER)
    }
  })

  it('checks the target id before reading a relationship', async () => {
    const relationship = vi.fn<FriendsService['relationship']>(() =>
      Promise.resolve({ status: 'none', canRequest: true, mutual: { count: 0, users: [] } })
    )
    const app = appWith({ friends: { relationship } })

    const invalid = await app.request('/api/v1/friends/12345')
    const self = await app.request(`/api/v1/friends/${ME}`)
    const found = await app.request(`/api/v1/friends/${OTHER}`)

    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toEqual({ message: 'Invalid user id' })
    expect(self.status).toBe(400)
    expect(await self.json()).toEqual({ message: 'Cannot target yourself' })
    expect(await found.json()).toEqual({ status: 'none', canRequest: true, mutual: { count: 0, users: [] } })
    expect(relationship.mock.calls).toEqual([[ME, OTHER]])
  })

  it('removes and always answers none', async () => {
    const remove = vi.fn<FriendsService['remove']>(() => Promise.resolve())

    const res = await appWith({ friends: { remove } }).request(`/api/v1/friends/${OTHER}`, { method: 'DELETE' })

    expect(await res.json()).toEqual({ status: 'none' })
    expect(remove).toHaveBeenCalledWith(ME, OTHER)
  })

  it('answers 500 with the generic message when the service fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await appWith({ friends: { list: () => Promise.reject(new Error('boom')) } }).request('/api/v1/friends')

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})

describe('blocks routes', () => {
  it('answers 401 without a session', async () => {
    const res = await appWith({}, null).request('/api/v1/blocks')
    expect(res.status).toBe(401)
  })

  it('returns the block list', async () => {
    const list = vi.fn<BlocksService['list']>(() => Promise.resolve({ blocked: [] }))

    const res = await appWith({ blocks: { list } }).request('/api/v1/blocks')

    expect(await res.json()).toEqual({ blocked: [] })
    expect(list).toHaveBeenCalledWith(ME)
  })

  it('blocks, refuses yourself and answers 404 for unknown users', async () => {
    const block = vi.fn<BlocksService['block']>((_, otherId) =>
      Promise.resolve(otherId === OTHER ? 'blocked' : 'not-found')
    )
    const app = appWith({ blocks: { block } })

    const self = await app.request('/api/v1/blocks', json('POST', { userId: ME }))
    const missing = await app.request('/api/v1/blocks', json('POST', { userId: '64b7f0c2a1b2c3d4e5f6071a' }))
    const blocked = await app.request('/api/v1/blocks', json('POST', { userId: OTHER }))

    expect(self.status).toBe(400)
    expect(await self.json()).toEqual({ message: 'Cannot block yourself' })
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'User not found' })
    expect(await blocked.json()).toEqual({ status: 'blocked' })
  })

  it('unblocks and answers none', async () => {
    const unblock = vi.fn<BlocksService['unblock']>(() => Promise.resolve())
    const app = appWith({ blocks: { unblock } })

    const invalid = await app.request('/api/v1/blocks/nope', { method: 'DELETE' })
    const res = await app.request(`/api/v1/blocks/${OTHER}`, { method: 'DELETE' })

    expect(invalid.status).toBe(400)
    expect(await res.json()).toEqual({ status: 'none' })
    expect(unblock.mock.calls).toEqual([[ME, OTHER]])
  })
})

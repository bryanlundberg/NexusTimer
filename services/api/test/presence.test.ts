import type { PresenceStatus } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { createRealtimePublisher } from '../src/infra/realtime'
import { createPresenceStore, gatewaysIn, resolvePresence } from '../src/modules/realtime/presence.store'
import { fakeRedis } from './fake-redis'
import { buildTestApp, testSessions } from './helpers'

const ALICE = '64b7f0c2a1b2c3d4e5f60718'
const UP = 'aaaa0000aaaa0000'
const GONE = 'bbbb1111bbbb1111'

const LIVE = new Set([UP])

const now = () => Math.floor(Date.now() / 1000)
const tab = (gateway: string, idle = false, ageSeconds = 0) => `${gateway}:${now() - ageSeconds}:${idle ? '1' : '0'}`

/** The same rules live in services/realtime/internal/broker/presence.go. */
describe('resolvePresence', () => {
  it('reads an open tab as online', () => {
    expect(resolvePresence(ALICE, { a: tab(UP) }, null, null, LIVE)).toEqual({ userId: ALICE, state: 'online' })
  })

  it('reads a declared status over the connection', () => {
    expect(resolvePresence(ALICE, { a: tab(UP) }, 'away', null, LIVE).state).toBe('away')
    expect(resolvePresence(ALICE, { a: tab(UP) }, 'busy', null, LIVE).state).toBe('busy')
  })

  it('lets a manual busy win over an idle tab', () => {
    expect(resolvePresence(ALICE, { a: tab(UP, true) }, 'busy', null, LIVE).state).toBe('busy')
  })

  it('reads away once every tab is idle', () => {
    expect(resolvePresence(ALICE, { a: tab(UP, true), b: tab(UP, true) }, null, null, LIVE).state).toBe('away')
  })

  it('stays online while any tab is still in use', () => {
    expect(resolvePresence(ALICE, { a: tab(UP, true), b: tab(UP) }, null, null, LIVE).state).toBe('online')
  })

  it('hides an invisible person behind the same shape as someone who left', () => {
    const invisible = resolvePresence(ALICE, { a: tab(UP) }, 'invisible', '1700000000000', LIVE)

    expect(invisible).toEqual({ userId: ALICE, state: 'offline', lastSeen: 1700000000000 })
    expect(invisible).toEqual(resolvePresence(ALICE, {}, null, '1700000000000', LIVE))
  })

  it('omits an invisible last seen it never had', () => {
    expect(resolvePresence(ALICE, { a: tab(UP) }, 'invisible', null, LIVE)).toEqual({ userId: ALICE, state: 'offline' })
  })

  it('reports the last seen time once nothing is connected', () => {
    expect(resolvePresence(ALICE, {}, null, '1700000000000', LIVE)).toEqual({
      userId: ALICE,
      state: 'offline',
      lastSeen: 1700000000000
    })
  })

  it('omits a last seen it never had', () => {
    expect(resolvePresence(ALICE, {}, null, null, LIVE)).toEqual({ userId: ALICE, state: 'offline' })
  })

  it('ignores tabs held by a gateway that is gone', () => {
    expect(resolvePresence(ALICE, { a: tab(GONE) }, null, '1700000000000', LIVE).state).toBe('offline')
  })

  it('still reads online when a dead gateway sits beside a live one', () => {
    expect(resolvePresence(ALICE, { a: tab(GONE), b: tab(UP) }, null, null, LIVE).state).toBe('online')
  })

  it('ignores an entry past the backstop even on a live gateway', () => {
    expect(resolvePresence(ALICE, { a: tab(UP, false, 25 * 60 * 60) }, null, null, LIVE).state).toBe('offline')
  })

  it('ignores entries it cannot read', () => {
    expect(resolvePresence(ALICE, { a: 'junk' }, null, null, LIVE).state).toBe('offline')
  })
})

describe('gatewaysIn', () => {
  it('names each gateway once, so liveness is asked about once', () => {
    expect(gatewaysIn({ a: tab(UP), b: tab(UP), c: tab(GONE), d: 'junk' }).sort()).toEqual([UP, GONE].sort())
  })

  it('returns nothing when nobody is connected', () => {
    expect(gatewaysIn({})).toEqual([])
  })
})

describe('presence store', () => {
  function setup() {
    const redis = fakeRedis()
    redis.strings.set(`rt:gw:${UP}`, '1')
    redis.hashes.set(`rt:conns:${ALICE}`, { a: tab(UP) })
    const store = createPresenceStore(redis.provider, createRealtimePublisher(redis.provider))
    const published = () =>
      redis.published.splice(0).map(({ channel, message }) => ({ channel, event: JSON.parse(message) }))
    return { redis, store, published }
  }

  it('stores the status without expiry and tells presence watchers', async () => {
    const { redis, store, published } = setup()

    await store.setStatus(ALICE, 'busy')

    expect(redis.strings.get(`rt:status:${ALICE}`)).toBe('busy')
    expect(redis.ttls.has(`rt:status:${ALICE}`)).toBe(false)
    expect(published()).toEqual([
      { channel: `rt:presence:${ALICE}`, event: { type: 'presence', users: [{ userId: ALICE, state: 'busy' }] } }
    ])
  })

  it('stamps last seen only when entering invisible and shows the stamp to watchers', async () => {
    const { redis, store, published } = setup()

    await store.setStatus(ALICE, 'invisible')
    const stamp = redis.strings.get(`rt:lastseen:${ALICE}`)
    redis.strings.set(`rt:lastseen:${ALICE}`, '1700000000000')
    await store.setStatus(ALICE, 'invisible')

    expect(Number(stamp)).toBeGreaterThan(1_700_000_000_000)
    expect(redis.ttls.get(`rt:lastseen:${ALICE}`)).toBe(30 * 24 * 60 * 60)
    expect(redis.strings.get(`rt:lastseen:${ALICE}`)).toBe('1700000000000')
    expect(published()[1]?.event.users).toEqual([{ userId: ALICE, state: 'offline', lastSeen: 1700000000000 }])
  })
})

describe('presence route', () => {
  function appWith(
    setStatus: (userId: string, status: PresenceStatus) => Promise<void>,
    userId: string | null = ALICE
  ) {
    return buildTestApp({ sessions: testSessions(userId), presence: { setStatus, clear: async () => {} } })
  }

  const patch = (body: unknown) => ({
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })

  it('answers 401 without a session', async () => {
    const res = await appWith(() => Promise.resolve(), null).request('/api/v1/presence/me', patch({ status: 'away' }))
    expect(res.status).toBe(401)
  })

  it('validates the status and echoes it back once saved', async () => {
    const setStatus = vi.fn(() => Promise.resolve())
    const app = appWith(setStatus)

    const invalid = await app.request('/api/v1/presence/me', patch({ status: 'offline' }))
    const saved = await app.request('/api/v1/presence/me', patch({ status: 'invisible' }))

    expect(invalid.status).toBe(400)
    expect(await saved.json()).toEqual({ status: 'invisible' })
    expect(setStatus.mock.calls).toEqual([[ALICE, 'invisible']])
  })

  it('answers 500 when the status cannot be saved', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await appWith(() => Promise.reject(new Error('redis down'))).request(
      '/api/v1/presence/me',
      patch({ status: 'away' })
    )

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})

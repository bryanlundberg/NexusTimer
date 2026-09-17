import { gatewaysIn, resolvePresence } from '@/shared/lib/realtime/presence'

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
    // Telling the two apart is the whole tell the status exists to avoid
    expect(invisible).toEqual(resolvePresence(ALICE, {}, null, '1700000000000', LIVE))
  })

  it('omits an invisible last seen it never had', () => {
    expect(resolvePresence(ALICE, { a: tab(UP) }, 'invisible', null, LIVE)).toEqual({
      userId: ALICE,
      state: 'offline'
    })
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

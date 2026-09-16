type Store = typeof import('@/features/presence/model/presence-store')
type Bus = typeof import('@/features/realtime/model/realtime-bus')

const ALICE = '64b7f0c2a1b2c3d4e5f60718'
const BOB = '64b7f0c2a1b2c3d4e5f60719'

describe('presence store', () => {
  let store: Store
  let bus: Bus
  let sent: string[]

  const flush = () => vi.advanceTimersByTime(100)
  const frames = () => sent.map((raw) => JSON.parse(raw) as { type: string; ids: string[] })

  beforeEach(async () => {
    vi.resetModules()
    vi.useFakeTimers()
    sent = []
    bus = await import('@/features/realtime/model/realtime-bus')
    store = await import('@/features/presence/model/presence-store')
    bus.setRealtimeSender((data) => sent.push(data))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('asks for everyone on screen in a single frame', () => {
    store.watchPresence([BOB, ALICE])
    flush()

    expect(frames()).toEqual([{ type: 'presence:watch', ids: [ALICE, BOB] }])
  })

  it('says nothing when the set has not changed', () => {
    store.watchPresence([ALICE])
    flush()
    store.watchPresence([ALICE])
    flush()

    expect(sent).toHaveLength(1)
  })

  it('keeps following someone a second component still needs', () => {
    const release = store.watchPresence([ALICE, BOB])
    store.watchPresence([ALICE])
    flush()
    sent = []

    release()
    flush()

    expect(frames()).toEqual([{ type: 'presence:watch', ids: [ALICE] }])
  })

  it('stops following once the last component lets go', () => {
    const release = store.watchPresence([ALICE])
    flush()
    sent = []

    release()
    flush()

    expect(frames()).toEqual([{ type: 'presence:watch', ids: [] }])
  })

  it('reports offline for anyone it has not heard about', () => {
    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'offline', lastSeen: null })
    expect(store.presenceStore.get(null)).toEqual({ state: 'offline', lastSeen: null })
  })

  it('keeps what the gateway published', () => {
    store.applyPresence([
      { userId: ALICE, state: 'busy' },
      { userId: BOB, state: 'offline', lastSeen: 1700000000000 }
    ])

    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'busy', lastSeen: null })
    expect(store.presenceStore.get(BOB)).toEqual({ state: 'offline', lastSeen: 1700000000000 })
  })

  it('only wakes subscribers when something actually changed', () => {
    const listener = vi.fn()
    store.presenceStore.subscribe(listener)

    store.applyPresence([{ userId: ALICE, state: 'online' }])
    expect(listener).toHaveBeenCalledTimes(1)

    store.applyPresence([{ userId: ALICE, state: 'online' }])
    expect(listener).toHaveBeenCalledTimes(1)

    store.applyPresence([{ userId: ALICE, state: 'away' }])
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('forgets someone it no longer follows, so a stale dot cannot come back', () => {
    const release = store.watchPresence([ALICE])
    store.applyPresence([{ userId: ALICE, state: 'online' }])
    flush()

    release()
    flush()

    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'offline', lastSeen: null })
  })

  // A route change unmounts and remounts inside one debounce, and the gateway is told nothing
  it('keeps the state of someone released and taken straight back', () => {
    const release = store.watchPresence([ALICE])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }])
    sent = []

    release()
    store.watchPresence([ALICE])
    flush()

    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'online', lastSeen: null })
    expect(sent).toHaveLength(0)
  })

  it('does not blink offline while a route change settles', () => {
    const release = store.watchPresence([ALICE, BOB])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }])

    release()
    store.watchPresence([ALICE])

    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'online', lastSeen: null })

    flush()
    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'online', lastSeen: null })
    expect(frames().at(-1)).toEqual({ type: 'presence:watch', ids: [ALICE] })
  })

  it('hands the whole set back after a reconnect', () => {
    store.watchPresence([ALICE])
    flush()
    sent = []

    store.resendWatch()
    flush()

    expect(frames()).toEqual([{ type: 'presence:watch', ids: [ALICE] }])
  })

  it('keeps the declared status the gateway handed over', () => {
    expect(store.selfStatusStore.get()).toBe('online')

    const listener = vi.fn()
    store.selfStatusStore.subscribe(listener)
    store.selfStatusStore.set('invisible')

    expect(store.selfStatusStore.get()).toBe('invisible')
    expect(listener).toHaveBeenCalledTimes(1)

    store.selfStatusStore.set('invisible')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('retries the set once a socket is there to take it', () => {
    bus.setRealtimeSender(null)
    store.watchPresence([ALICE])
    flush()
    expect(sent).toHaveLength(0)

    bus.setRealtimeSender((data) => sent.push(data))
    store.watchPresence([BOB])
    flush()

    expect(frames()).toEqual([{ type: 'presence:watch', ids: [ALICE, BOB] }])
  })
})

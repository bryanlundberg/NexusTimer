type Store = typeof import('@/features/presence/model/presence-store')
type Bus = typeof import('@/features/realtime/model/realtime-bus')

const ALICE = '64b7f0c2a1b2c3d4e5f60718'
const BOB = '64b7f0c2a1b2c3d4e5f60719'

describe('presence store', () => {
  let store: Store
  let bus: Bus
  let sent: string[]

  const flush = () => vi.advanceTimersByTime(200)
  const parse = (raw: string) => JSON.parse(raw) as { type: string; ids: string[]; seq: number }
  const frames = () => sent.map((raw) => ({ type: parse(raw).type, ids: parse(raw).ids }))
  const sequences = () => sent.map((raw) => parse(raw).seq)

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

  it('says unknown, not offline, for anyone it has not heard about', () => {
    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'unknown', lastSeen: null })
    expect(store.presenceStore.get(null)).toEqual({ state: 'unknown', lastSeen: null })
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

  it('holds a released dot for a while, then lets it go stale', () => {
    const release = store.watchPresence([ALICE])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }])

    release()
    flush()
    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'online', lastSeen: null })

    vi.advanceTimersByTime(60_000)
    expect(store.presenceStore.get(ALICE)).toEqual({ state: 'unknown', lastSeen: null })
  })

  it('asks again when the gateway never answers the watch', () => {
    store.watchPresence([ALICE])
    flush()
    expect(sent).toHaveLength(1)

    vi.advanceTimersByTime(2_200)

    expect(frames()).toEqual([
      { type: 'presence:watch', ids: [ALICE] },
      { type: 'presence:watch', ids: [ALICE] }
    ])
  })

  it('tags every watch with a rising sequence', () => {
    store.watchPresence([ALICE])
    flush()
    store.watchPresence([BOB])
    flush()

    expect(sequences()).toEqual([1, 2])
  })

  it('takes the snapshot carrying its own sequence as the answer', () => {
    store.watchPresence([ALICE])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }], 1)

    vi.advanceTimersByTime(10_000)

    expect(sent).toHaveLength(1)
  })

  it('does not take a snapshot meant for another watch as the answer', () => {
    store.watchPresence([ALICE])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }], 99)

    vi.advanceTimersByTime(2_200)

    expect(sent).toHaveLength(2)
  })

  it('stops asking once a snapshot covers the set', () => {
    store.watchPresence([ALICE])
    flush()
    store.applyPresence([{ userId: ALICE, state: 'online' }])

    vi.advanceTimersByTime(10_000)

    expect(sent).toHaveLength(1)
  })

  it('calls the socket stalled after two watches go unanswered', () => {
    const stalled = vi.fn()
    bus.subscribeRealtime((event) => {
      if (event.type === 'realtime:stalled') stalled()
    })

    store.watchPresence([ALICE])
    flush()

    vi.advanceTimersByTime(2_200)
    expect(stalled).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2_200)
    expect(stalled).toHaveBeenCalledTimes(1)
  })

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

import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import type { PresenceDisplay, PresenceStatus, PresenceUser } from '@/shared/lib/realtime/events'

export interface PresenceState {
  state: PresenceDisplay
  lastSeen: number | null
}

export const OFFLINE: PresenceState = { state: 'offline', lastSeen: null }

/** Components come and go while a page renders, so the watch frame waits for them to settle. */
const FLUSH_DELAY_MS = 50

const counts = new Map<string, number>()
const states = new Map<string, PresenceState>()
const listeners = new Set<() => void>()

let version = 0
let flushTimer: ReturnType<typeof setTimeout> | undefined
// What the gateway was last told, so a set that did not change costs nothing.
let sentKey = ''

function publish() {
  version++
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function scheduleFlush() {
  clearTimeout(flushTimer)
  flushTimer = setTimeout(flush, FLUSH_DELAY_MS)
}

function flush() {
  flushTimer = undefined
  const ids = [...counts.keys()].sort()

  // Forgetting happens here rather than on release: a route change releases and takes the same
  // person back within the debounce, and dropping their state there left the dot offline with
  // no new watch to refill it.
  for (const id of states.keys()) if (!counts.has(id)) states.delete(id)

  const key = ids.join(',')
  if (key === sentKey) return

  // A closed socket leaves sentKey empty, so the set goes out again on connect
  sentKey = sendRealtime({ type: 'presence:watch', ids }) ? key : ''
}

/**
 * Follows these people until the returned function is called. Reference counted, so the same
 * person showing up in a list and in an open conversation is still watched once.
 */
export function watchPresence(userIds: string[]): () => void {
  for (const id of userIds) counts.set(id, (counts.get(id) ?? 0) + 1)
  scheduleFlush()

  return () => {
    for (const id of userIds) {
      const left = (counts.get(id) ?? 1) - 1
      if (left > 0) counts.set(id, left)
      else counts.delete(id)
    }
    scheduleFlush()
  }
}

export function applyPresence(users: PresenceUser[]) {
  let changed = false
  for (const { userId, state, lastSeen } of users) {
    const previous = states.get(userId)
    if (previous?.state === state && previous.lastSeen === (lastSeen ?? null)) continue
    states.set(userId, { state, lastSeen: lastSeen ?? null })
    changed = true
  }
  if (changed) publish()
}

/** After a socket opens the gateway knows nothing about this tab, so the set goes out again. */
export function resendWatch() {
  sentKey = ''
  scheduleFlush()
}

export const presenceStore = {
  subscribe,
  getVersion: () => version,
  get: (userId?: string | null) => (userId ? (states.get(userId) ?? OFFLINE) : OFFLINE)
}

/** Declared by this account and handed over by the gateway when the socket opens. */
let selfStatus: PresenceStatus = 'online'
const statusListeners = new Set<() => void>()

export const selfStatusStore = {
  subscribe(listener: () => void) {
    statusListeners.add(listener)
    return () => {
      statusListeners.delete(listener)
    }
  },
  get: () => selfStatus,
  set(status: PresenceStatus) {
    if (selfStatus === status) return
    selfStatus = status
    for (const listener of statusListeners) listener()
  }
}

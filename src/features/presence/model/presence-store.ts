import { emitRealtime, sendRealtime } from '@/features/realtime/model/realtime-bus'
import type { PresenceDisplay, PresenceStatus, PresenceUser } from '@/shared/lib/realtime/events'

export type PresenceView = PresenceDisplay | 'unknown'

export interface PresenceState {
  state: PresenceView
  lastSeen: number | null
}

export const UNKNOWN: PresenceState = { state: 'unknown', lastSeen: null }

const FLUSH_DELAY_MS = 150

const RETAIN_MS = 60_000

const ACK_TIMEOUT_MS = 2_000
const STALL_AFTER_MISSES = 2

const counts = new Map<string, number>()
const states = new Map<string, PresenceState>()
const unwatchedSince = new Map<string, number>()
const listeners = new Set<() => void>()

let version = 0
let flushTimer: ReturnType<typeof setTimeout> | undefined
let ackTimer: ReturnType<typeof setTimeout> | undefined
// null rather than '': an empty set still needs one send.
let confirmedKey: string | null = null
let pendingKey: string | null = null
let pendingIds: string[] = []
let pendingSeq = 0
let nextSeq = 1
let misses = 0

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

function expired(userId: string, now: number): boolean {
  const since = unwatchedSince.get(userId)
  return since !== undefined && now - since >= RETAIN_MS
}

function sweep(now: number) {
  for (const id of states.keys()) {
    if (counts.has(id)) {
      unwatchedSince.delete(id)
      continue
    }
    if (!unwatchedSince.has(id)) unwatchedSince.set(id, now)
    else if (expired(id, now)) {
      states.delete(id)
      unwatchedSince.delete(id)
    }
  }
}

function flush() {
  flushTimer = undefined
  sweep(Date.now())

  const ids = [...counts.keys()].sort()
  const key = ids.join(',')
  if (key === confirmedKey || key === pendingKey) return

  const seq = nextSeq++
  if (!sendRealtime({ type: 'presence:watch', ids, seq })) {
    pendingKey = null
    return
  }

  clearTimeout(ackTimer)
  pendingKey = key
  pendingIds = ids
  pendingSeq = seq
  ackTimer = setTimeout(missedAck, ACK_TIMEOUT_MS)
}

function missedAck() {
  ackTimer = undefined
  pendingKey = null
  misses++

  if (misses >= STALL_AFTER_MISSES) {
    misses = 0
    emitRealtime({ type: 'realtime:stalled' })
  }
  scheduleFlush()
}

function acknowledges(users: PresenceUser[], seq?: number): boolean {
  if (seq !== undefined) return seq === pendingSeq
  const seen = new Set(users.map((user) => user.userId))
  return pendingIds.every((id) => seen.has(id))
}

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

export function applyPresence(users: PresenceUser[], seq?: number) {
  let changed = false
  for (const { userId, state, lastSeen } of users) {
    const previous = states.get(userId)
    if (previous?.state === state && previous.lastSeen === (lastSeen ?? null)) continue
    states.set(userId, { state, lastSeen: lastSeen ?? null })
    changed = true
  }

  if (pendingKey !== null && acknowledges(users, seq)) {
    confirmedKey = pendingKey
    pendingKey = null
    misses = 0
    clearTimeout(ackTimer)
    ackTimer = undefined
  }

  if (changed) publish()
}

export function resendWatch() {
  confirmedKey = null
  pendingKey = null
  misses = 0
  clearTimeout(ackTimer)
  ackTimer = undefined
  scheduleFlush()
}

export const presenceStore = {
  subscribe,
  getVersion: () => version,
  get: (userId?: string | null) => {
    if (!userId) return UNKNOWN
    const state = states.get(userId)
    if (!state || expired(userId, Date.now())) return UNKNOWN
    return state
  }
}

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

import { useSyncExternalStore } from 'react'

/** The sender repeats the signal while typing, so the indicator hides a bit after the last one. */
export const TYPING_TTL_MS = 4000

const timers = new Map<string, ReturnType<typeof setTimeout>>()
const listeners = new Set<() => void>()
const EMPTY: ReadonlySet<string> = new Set()
let snapshot: ReadonlySet<string> = EMPTY

function publish() {
  snapshot = timers.size === 0 ? EMPTY : new Set(timers.keys())
  for (const listener of listeners) listener()
}

export function markTyping(userId: string) {
  const isNew = !timers.has(userId)
  clearTimeout(timers.get(userId))
  timers.set(
    userId,
    setTimeout(() => clearTyping(userId), TYPING_TTL_MS)
  )
  if (isNew) publish()
}

export function clearTyping(userId: string) {
  if (!timers.has(userId)) return
  clearTimeout(timers.get(userId))
  timers.delete(userId)
  publish()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useTypingUsers(): ReadonlySet<string> {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY
  )
}

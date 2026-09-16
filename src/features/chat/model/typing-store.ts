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

export function markTyping(chatId: string) {
  const isNew = !timers.has(chatId)
  clearTimeout(timers.get(chatId))
  timers.set(
    chatId,
    setTimeout(() => clearTyping(chatId), TYPING_TTL_MS)
  )
  if (isNew) publish()
}

export function clearTyping(chatId: string) {
  if (!timers.has(chatId)) return
  clearTimeout(timers.get(chatId))
  timers.delete(chatId)
  publish()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Chats where someone is typing right now. */
export function useTypingChats(): ReadonlySet<string> {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY
  )
}

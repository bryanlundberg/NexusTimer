import type { RealtimeClientFrame, RealtimeEvent } from '@/shared/lib/realtime/events'

export type RealtimeClientEvent = RealtimeEvent | { type: 'realtime:connected' } | { type: 'realtime:reconnected' }

type Listener = (event: RealtimeClientEvent) => void

const listeners = new Set<Listener>()
let sender: ((data: string) => void) | null = null

export function subscribeRealtime(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitRealtime(event: RealtimeClientEvent) {
  for (const listener of listeners) listener(event)
}

export function setRealtimeSender(send: ((data: string) => void) | null) {
  sender = send
}

/** Returns false when there is no open connection; frames are never queued. */
export function sendRealtime(frame: RealtimeClientFrame): boolean {
  if (!sender) return false
  sender(JSON.stringify(frame))
  return true
}

import type { RealtimeEvent } from '@/shared/lib/realtime/events'

export type RealtimeClientEvent = RealtimeEvent | { type: 'realtime:reconnected' }

type Listener = (event: RealtimeClientEvent) => void

const listeners = new Set<Listener>()

export function subscribeRealtime(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitRealtime(event: RealtimeClientEvent) {
  for (const listener of listeners) listener(event)
}

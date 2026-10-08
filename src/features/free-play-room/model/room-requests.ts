import type { RoomClientFrame, RoomEvent } from '@nexustimer/contracts'
import { type RealtimeClientEvent, sendRealtime, subscribeRealtime } from '@/features/realtime/model/realtime-bus'

const REQUEST_TIMEOUT_MS = 10_000

let lastRid = 0

export const nextRid = () => ++lastRid

export function isRoomEvent(event: RealtimeClientEvent): event is RoomEvent {
  return event.type.startsWith('room:') || event.type.startsWith('rooms:')
}

type RequestFrame = Extract<RoomClientFrame, { rid: number }>

// Resolves with the first room event that answers this frame's rid: a reply or a room:error.
export function requestRoom(frame: RequestFrame, timeoutMs = REQUEST_TIMEOUT_MS): Promise<RoomEvent> {
  return new Promise((resolve, reject) => {
    const unsubscribe = subscribeRealtime((event) => {
      if (!isRoomEvent(event) || !('rid' in event) || event.rid !== frame.rid) return
      clearTimeout(timer)
      unsubscribe()
      resolve(event)
    })
    const timer = setTimeout(() => {
      unsubscribe()
      reject(new Error('Room request timed out'))
    }, timeoutMs)

    if (!sendRealtime(frame)) {
      clearTimeout(timer)
      unsubscribe()
      reject(new Error('Realtime is not connected'))
    }
  })
}

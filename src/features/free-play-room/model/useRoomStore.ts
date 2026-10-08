import { create } from 'zustand'
import type { RoomEvent } from '@nexustimer/contracts'
import {
  initialRoomState,
  reduceRoomEvent,
  type RoomState,
  startJoin
} from '@/features/free-play-room/model/room-state'

type RoomStore = RoomState & {
  begin: (roomId: string, rid: number, withCode: boolean) => void
  apply: (event: RoomEvent) => void
  reset: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  ...initialRoomState,
  begin: (roomId, rid, withCode) => set((state) => startJoin(state, roomId, rid, withCode)),
  apply: (event) => set((state) => reduceRoomEvent(state, event, Date.now())),
  reset: () => set(initialRoomState)
}))

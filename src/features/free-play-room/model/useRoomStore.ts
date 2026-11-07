import { create } from 'zustand'
import type { RoomEvent } from '@nexustimer/contracts'
import {
  initialRoomState,
  markChatRead,
  reduceRoomEvent,
  type RoomState,
  startJoin
} from '@/features/free-play-room/model/room-state'

type RoomStore = RoomState & {
  begin: (roomId: string, rid: number, withCode: boolean) => void
  apply: (event: RoomEvent) => void
  markChatRead: (id: number) => void
  reset: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  ...initialRoomState,
  begin: (roomId, rid, withCode) => set((state) => startJoin(state, roomId, rid, withCode)),
  apply: (event) => set((state) => reduceRoomEvent(state, event, Date.now())),
  markChatRead: (id) => set((state) => markChatRead(state, id)),
  reset: () => set(initialRoomState)
}))

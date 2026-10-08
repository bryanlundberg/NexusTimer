import type { RoomPenalty, RoomReportedStatus } from '@nexustimer/contracts'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { nextRid } from '@/features/free-play-room/model/room-requests'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'

let reported: { roomId: string; status: RoomReportedStatus } | null = null

export function forgetReportedStatus() {
  reported = null
}

export function reportRoomStatus(status: RoomReportedStatus) {
  const roomId = useRoomStore.getState().roomId
  if (!roomId || (reported?.roomId === roomId && reported.status === status)) return
  if (sendRealtime({ type: 'room:status', roomId, status })) reported = { roomId, status }
}

export function submitRoomSolve(round: number, time: number) {
  const roomId = useRoomStore.getState().roomId
  if (!roomId) return false
  return sendRealtime({ type: 'room:solve', rid: nextRid(), roomId, round, time: Math.round(time) })
}

export function setRoomPenalty(round: number, penalty: RoomPenalty) {
  const roomId = useRoomStore.getState().roomId
  if (!roomId) return false
  return sendRealtime({ type: 'room:penalty', rid: nextRid(), roomId, round, penalty })
}

export function kickRoomPlayer(userId: string) {
  const roomId = useRoomStore.getState().roomId
  if (!roomId) return false
  return sendRealtime({ type: 'room:kick', rid: nextRid(), roomId, userId })
}

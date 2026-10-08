import type { RoomPlayerStatus, RoomSnapshot } from '@nexustimer/contracts'
import { TimerStatus } from '@/features/timer/model/enums'
import type { KnownPlayer } from '@/features/free-play-room/model/room-state'

export interface RoomPresence {
  id: string
  name: string
  image: string | null
  status: TimerStatus
  online: boolean
}

export interface RoomSolveView {
  time: number
  plus2: boolean
  dnf: boolean
  roundIndex: number
  pending: boolean
  userName?: string
  userImage?: string | null
}

const STATUS: Record<RoomPlayerStatus, TimerStatus> = {
  idle: TimerStatus.IDLE,
  inspecting: TimerStatus.INSPECTING,
  solving: TimerStatus.SOLVING,
  done: TimerStatus.WAITING_NEXT_ROUND
}

const PLUS_TWO_MS = 2000

export function toPresence(room: RoomSnapshot | null): RoomPresence[] {
  if (!room) return []
  return room.players.map((player) => ({
    id: player.userId,
    name: player.name,
    image: player.image,
    status: STATUS[player.status],
    online: player.online
  }))
}

// The shape the results and live panels read, so their math stays as it was with Firebase.
export function toSolvesByUser(
  room: RoomSnapshot | null,
  known: Record<string, KnownPlayer> = {}
): Record<string, Record<string, RoomSolveView>> {
  const byUser: Record<string, Record<string, RoomSolveView>> = {}
  if (!room) return byUser
  for (const solve of room.solves) {
    const plus2 = solve.penalty === 'plus2'
    byUser[solve.userId] ??= {}
    byUser[solve.userId][String(solve.round)] = {
      time: plus2 ? solve.time + PLUS_TWO_MS : solve.time,
      plus2,
      dnf: solve.penalty === 'dnf',
      roundIndex: solve.round,
      pending: solve.penalty === null,
      userName: known[solve.userId]?.name,
      userImage: known[solve.userId]?.image
    }
  }
  return byUser
}

export function toLocalTime(serverMs: number, clockOffset: number): number | undefined {
  return serverMs > 0 ? serverMs - clockOffset : undefined
}

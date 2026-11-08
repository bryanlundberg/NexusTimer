import type { RoomSnapshot } from '@nexustimer/contracts'

export function maxManualTime(room: RoomSnapshot | null, userId: string | undefined, clockOffset: number, now: number) {
  if (!room) return 0
  const joinedAt = room.players.find((player) => player.userId === userId)?.joinedAt ?? 0
  const since = Math.max(room.round.startsAt, joinedAt) - clockOffset
  return Math.max(0, now - since)
}

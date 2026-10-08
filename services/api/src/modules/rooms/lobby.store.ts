import type { RoomSummary } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'

/** Written by the realtime gateway, services/realtime/internal/rooms/store.go. */
const LOBBY_KEY = 'rt:rooms'

export type RoomLobby = { list(): Promise<RoomSummary[]> }

function parseSummary(raw: string): RoomSummary | null {
  try {
    const summary = JSON.parse(raw) as RoomSummary
    return typeof summary?.roomId === 'string' && Array.isArray(summary.players) ? summary : null
  } catch {
    return null
  }
}

export function createRoomLobby(redis: () => Promise<RedisClientType>): RoomLobby {
  return {
    async list() {
      const fields = await (await redis()).hGetAll(LOBBY_KEY)
      return Object.values(fields)
        .map(parseSummary)
        .filter((summary): summary is RoomSummary => summary !== null && summary.players.length > 0)
        .sort((a, b) => b.createdAt - a.createdAt)
    }
  }
}

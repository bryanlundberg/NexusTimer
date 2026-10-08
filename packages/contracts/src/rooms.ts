import * as z from 'zod'
import type { CubeCategory } from './cube-categories'

export const ROOM_PROTOCOL_VERSION = 1

export const FREE_PLAY_EVENTS = [
  '2x2',
  '3x3',
  '4x4',
  '5x5',
  '6x6',
  '7x7',
  '3x3 OH',
  'Clock',
  'Megaminx',
  'Pyraminx',
  'Skewb',
  'FTO',
  'SQ1'
] as const satisfies readonly CubeCategory[]

export type FreePlayEvent = (typeof FREE_PLAY_EVENTS)[number]

export const ROOM_ROUND_SECONDS = [60, 120, 180, 300, 600] as const

export const ROOM_NAME_MAX_LENGTH = 40

export const ROOM_CODE_LENGTH = 6

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(ROOM_NAME_MAX_LENGTH),
  event: z.enum(FREE_PLAY_EVENTS),
  maxRoundTime: z.literal(ROOM_ROUND_SECONDS),
  private: z.boolean()
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>

export const ROOM_SCRAMBLES_PER_REQUEST = 10

/** The gateway asks the API for scrambles: POST /api/internal/scrambles with the realtime secret as a bearer token. */
export const internalScramblesSchema = z.object({
  event: z.enum(FREE_PLAY_EVENTS),
  count: z.number().int().min(1).max(ROOM_SCRAMBLES_PER_REQUEST)
})

export type InternalScramblesResponse = { scrambles: string[] }

export const ROOM_PENALTIES = ['ok', 'plus2', 'dnf'] as const

export type RoomPenalty = (typeof ROOM_PENALTIES)[number]

export const ROOM_PLAYER_STATUSES = ['idle', 'inspecting', 'solving', 'done'] as const

export type RoomPlayerStatus = (typeof ROOM_PLAYER_STATUSES)[number]

export type RoomReportedStatus = Exclude<RoomPlayerStatus, 'done'>

export const ROOM_ERROR_CODES = [
  'not-found',
  'wrong-code',
  'full',
  'banned',
  'forbidden',
  'too-many-attempts',
  'upgrade-required',
  'invalid'
] as const

export type RoomErrorCode = (typeof ROOM_ERROR_CODES)[number]

export interface RoomPlayer {
  userId: string
  name: string
  image: string | null
  joinedAt: number
  status: RoomPlayerStatus
  statusAt: number
  online: boolean
}

export interface RoomRound {
  index: number
  scramble: string | null
  startsAt: number
  deadline: number
}

export interface RoomSolve {
  userId: string
  round: number
  time: number
  penalty: RoomPenalty | null
  confirmBy: number
  submittedAt: number
}

export interface RoomSnapshot {
  roomId: string
  name: string
  event: FreePlayEvent
  private: boolean
  code?: string
  maxRoundTime: number
  maxPlayers: number
  createdBy: string
  createdAt: number
  leaderId: string | null
  round: RoomRound
  players: RoomPlayer[]
  solves: RoomSolve[]
  version: number
}

export interface RoomSummary {
  roomId: string
  name: string
  event: FreePlayEvent
  private: boolean
  maxRoundTime: number
  maxPlayers: number
  createdAt: number
  roundDeadline: number
  players: Pick<RoomPlayer, 'userId' | 'name' | 'image'>[]
}

export type RoomEvent =
  | { type: 'room:created'; rid: number; roomId: string }
  | { type: 'room:snapshot'; rid?: number; room: RoomSnapshot; serverNow: number }
  | { type: 'room:round'; roomId: string; round: RoomRound; serverNow: number; version: number }
  | { type: 'room:solve'; roomId: string; solve: RoomSolve; version: number }
  | { type: 'room:members'; roomId: string; players: RoomPlayer[]; leaderId: string | null; version: number }
  | { type: 'room:player'; roomId: string; player: RoomPlayer; version: number }
  | { type: 'room:kicked'; roomId: string }
  | { type: 'room:replaced'; roomId: string; toRoomId: string }
  | { type: 'room:closed'; roomId: string }
  | { type: 'room:error'; rid?: number; roomId?: string; code: RoomErrorCode }
  | { type: 'rooms:lobby'; rid?: number; rooms: RoomSummary[] }

export type RoomClientFrame =
  | ({ type: 'room:create'; rid: number } & CreateRoomInput)
  | { type: 'room:join'; rid: number; roomId: string; code?: string; protocol: number }
  | { type: 'room:leave'; roomId: string }
  | { type: 'room:status'; roomId: string; status: RoomReportedStatus }
  | { type: 'room:solve'; rid: number; roomId: string; round: number; time: number }
  | { type: 'room:penalty'; rid: number; roomId: string; round: number; penalty: RoomPenalty }
  | { type: 'room:kick'; rid: number; roomId: string; userId: string }
  | { type: 'rooms:watch'; rid: number }
  | { type: 'rooms:unwatch' }

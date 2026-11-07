import type {
  RoomChatMessage,
  RoomErrorCode,
  RoomEvent,
  RoomPlayer,
  RoomSnapshot,
  RoomSolve
} from '@nexustimer/contracts'

export type RoomPhase =
  | 'idle'
  | 'joining'
  | 'joined'
  | 'code-required'
  | 'wrong-code'
  | 'too-many-attempts'
  | 'not-found'
  | 'banned'
  | 'full'
  | 'upgrade-required'
  | 'kicked'
  | 'replaced'
  | 'moved'
  | 'closed'

export interface KnownPlayer {
  name: string
  image: string | null
}

export interface RoomState {
  roomId: string | null
  joinRid: number | null
  joinedWithCode: boolean
  phase: RoomPhase
  room: RoomSnapshot | null
  clockOffset: number
  knownPlayers: Record<string, KnownPlayer>
  chatReadId: number
}

export const initialRoomState: RoomState = {
  roomId: null,
  joinRid: null,
  joinedWithCode: false,
  phase: 'idle',
  room: null,
  clockOffset: 0,
  knownPlayers: {},
  chatReadId: 0
}

const ERROR_PHASES: Record<RoomErrorCode, RoomPhase | null> = {
  'not-found': 'not-found',
  'wrong-code': 'wrong-code',
  full: 'full',
  banned: 'banned',
  forbidden: null,
  'too-many-attempts': 'too-many-attempts',
  'upgrade-required': 'upgrade-required',
  invalid: null,
  'rate-limited': null
}

export function startJoin(state: RoomState, roomId: string, rid: number, withCode: boolean): RoomState {
  const rejoining = state.roomId === roomId && state.phase === 'joined'
  return {
    ...(state.roomId === roomId ? state : initialRoomState),
    roomId,
    joinRid: rid,
    joinedWithCode: withCode,
    phase: rejoining ? 'joined' : 'joining'
  }
}

function joinFailed(state: RoomState, code: RoomErrorCode): RoomState {
  if (code === 'wrong-code' && !state.joinedWithCode) return { ...state, phase: 'code-required' }
  const phase = ERROR_PHASES[code]
  return phase ? { ...state, phase } : state
}

function remember(known: Record<string, KnownPlayer>, players: RoomPlayer[]): Record<string, KnownPlayer> {
  const next = { ...known }
  for (const player of players) next[player.userId] = { name: player.name, image: player.image }
  return next
}

function upsertSolve(solves: RoomSolve[], solve: RoomSolve): RoomSolve[] {
  const index = solves.findIndex((s) => s.userId === solve.userId && s.round === solve.round)
  if (index < 0) return [...solves, solve]
  return solves.map((s, i) => (i === index ? solve : s))
}

function upsertPlayer(players: RoomPlayer[], player: RoomPlayer): RoomPlayer[] {
  const index = players.findIndex((p) => p.userId === player.userId)
  if (index < 0) return [...players, player]
  return players.map((p, i) => (i === index ? player : p))
}

export function lastChatId(chat: RoomChatMessage[] | undefined) {
  return chat?.at(-1)?.id ?? 0
}

function appendChat(chat: RoomChatMessage[] | undefined, message: RoomChatMessage): RoomChatMessage[] {
  const messages = chat ?? []
  if (messages.some((m) => m.id === message.id)) return messages
  return [...messages, message]
}

export function markChatRead(state: RoomState, id: number): RoomState {
  return id > state.chatReadId ? { ...state, chatReadId: id } : state
}

export function reduceRoomEvent(state: RoomState, event: RoomEvent, now: number): RoomState {
  switch (event.type) {
    case 'room:snapshot':
      if (event.room.roomId !== state.roomId) return state
      return {
        ...state,
        phase: 'joined',
        room: event.room,
        clockOffset: event.serverNow - now,
        knownPlayers: remember(state.knownPlayers, event.room.players),
        chatReadId: state.room?.roomId === event.room.roomId ? state.chatReadId : lastChatId(event.room.chat)
      }
    case 'room:error':
      if (event.rid === undefined || event.rid !== state.joinRid) return state
      return joinFailed(state, event.code)
    case 'room:kicked':
    case 'room:closed':
      if (event.roomId !== state.roomId) return state
      return { ...state, phase: event.type === 'room:kicked' ? 'kicked' : 'closed' }
    case 'room:replaced':
      if (event.roomId !== state.roomId) return state
      return { ...state, phase: event.toRoomId === event.roomId ? 'replaced' : 'moved' }
  }

  const room = state.room
  if (!room || !('roomId' in event) || event.roomId !== room.roomId) return state
  if (!('version' in event) || event.version <= room.version) return state

  switch (event.type) {
    case 'room:round':
      return {
        ...state,
        clockOffset: event.serverNow - now,
        room: { ...room, round: event.round, version: event.version }
      }
    case 'room:solve':
      return { ...state, room: { ...room, solves: upsertSolve(room.solves, event.solve), version: event.version } }
    case 'room:members':
      return {
        ...state,
        room: { ...room, players: event.players, leaderId: event.leaderId, version: event.version },
        knownPlayers: remember(state.knownPlayers, event.players)
      }
    case 'room:chat':
      return { ...state, room: { ...room, chat: appendChat(room.chat, event.message), version: event.version } }
    case 'room:player':
      return {
        ...state,
        room: { ...room, players: upsertPlayer(room.players, event.player), version: event.version },
        knownPlayers: remember(state.knownPlayers, [event.player])
      }
  }
  return state
}

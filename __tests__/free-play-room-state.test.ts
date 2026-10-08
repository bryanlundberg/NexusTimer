import type { RoomPlayer, RoomSnapshot, RoomSolve } from '@nexustimer/contracts'
import {
  initialRoomState,
  reduceRoomEvent,
  type RoomState,
  startJoin
} from '@/features/free-play-room/model/room-state'
import { toPresence, toSolvesByUser } from '@/features/free-play-room/model/room-view'
import { TimerStatus } from '@/features/timer/model/enums'

const NOW = 1_700_000_000_000

const player = (userId: string, overrides: Partial<RoomPlayer> = {}): RoomPlayer => ({
  userId,
  name: userId.toUpperCase(),
  image: null,
  joinedAt: NOW,
  status: 'idle',
  statusAt: NOW,
  online: true,
  ...overrides
})

const solve = (userId: string, round: number, overrides: Partial<RoomSolve> = {}): RoomSolve => ({
  userId,
  round,
  time: 10_000,
  penalty: null,
  confirmBy: NOW + 15_000,
  submittedAt: NOW,
  ...overrides
})

const snapshot = (overrides: Partial<RoomSnapshot> = {}): RoomSnapshot => ({
  roomId: 'room1',
  name: 'Sala',
  event: '3x3',
  private: false,
  maxRoundTime: 60,
  maxPlayers: 16,
  createdBy: 'ana',
  createdAt: NOW,
  leaderId: 'ana',
  round: { index: 1, scramble: 'R U', startsAt: NOW, deadline: NOW + 60_000 },
  players: [player('ana')],
  solves: [],
  version: 5,
  ...overrides
})

const joined = (): RoomState =>
  reduceRoomEvent(
    startJoin(initialRoomState, 'room1', 1, false),
    {
      type: 'room:snapshot',
      rid: 1,
      room: snapshot(),
      serverNow: NOW + 300
    },
    NOW
  )

describe('room state', () => {
  it('joins with the snapshot and keeps the server clock offset', () => {
    const state = joined()

    expect(state.phase).toBe('joined')
    expect(state.room?.roomId).toBe('room1')
    expect(state.clockOffset).toBe(300)
    expect(state.knownPlayers.ana).toEqual({ name: 'ANA', image: null })
  })

  it('ignores snapshots of other rooms', () => {
    const state = reduceRoomEvent(
      startJoin(initialRoomState, 'room1', 1, false),
      { type: 'room:snapshot', room: snapshot({ roomId: 'other' }), serverNow: NOW },
      NOW
    )

    expect(state.phase).toBe('joining')
  })

  it('stays joined while rejoining after a reconnect', () => {
    expect(startJoin(joined(), 'room1', 2, false).phase).toBe('joined')
    expect(startJoin(joined(), 'room2', 2, false)).toMatchObject({ phase: 'joining', room: null, roomId: 'room2' })
  })

  it('applies newer events and drops stale ones', () => {
    let state = joined()

    state = reduceRoomEvent(state, { type: 'room:solve', roomId: 'room1', solve: solve('ana', 1), version: 6 }, NOW)
    state = reduceRoomEvent(
      state,
      { type: 'room:solve', roomId: 'room1', solve: solve('ana', 1, { penalty: 'plus2' }), version: 7 },
      NOW
    )
    state = reduceRoomEvent(
      state,
      { type: 'room:solve', roomId: 'room1', solve: solve('ana', 1, { penalty: 'dnf' }), version: 7 },
      NOW
    )

    expect(state.room?.solves).toEqual([solve('ana', 1, { penalty: 'plus2' })])
    expect(state.room?.version).toBe(7)
  })

  it('follows rounds, members and single player changes', () => {
    let state = joined()

    state = reduceRoomEvent(
      state,
      {
        type: 'room:round',
        roomId: 'room1',
        round: { index: 2, scramble: 'F2', startsAt: NOW, deadline: NOW + 60_000 },
        serverNow: NOW + 500,
        version: 6
      },
      NOW
    )
    state = reduceRoomEvent(
      state,
      { type: 'room:members', roomId: 'room1', players: [player('ana'), player('ben')], leaderId: 'ben', version: 7 },
      NOW
    )
    state = reduceRoomEvent(
      state,
      { type: 'room:player', roomId: 'room1', player: player('ben', { status: 'solving' }), version: 8 },
      NOW
    )

    expect(state.room?.round.index).toBe(2)
    expect(state.clockOffset).toBe(500)
    expect(state.room?.leaderId).toBe('ben')
    expect(state.room?.players.map((p) => [p.userId, p.status])).toEqual([
      ['ana', 'idle'],
      ['ben', 'solving']
    ])
    expect(state.knownPlayers.ben).toEqual({ name: 'BEN', image: null })
  })

  it('remembers players who left so results keep their names', () => {
    let state = reduceRoomEvent(
      joined(),
      { type: 'room:members', roomId: 'room1', players: [player('ana'), player('ben')], leaderId: 'ana', version: 6 },
      NOW
    )
    state = reduceRoomEvent(
      state,
      { type: 'room:members', roomId: 'room1', players: [player('ana')], leaderId: 'ana', version: 7 },
      NOW
    )

    expect(state.knownPlayers.ben).toEqual({ name: 'BEN', image: null })
  })

  it('turns join errors into phases, asking for a code before calling it wrong', () => {
    const fail = (withCode: boolean, code: 'wrong-code' | 'banned' | 'forbidden', rid = 1) =>
      reduceRoomEvent(
        startJoin(initialRoomState, 'room1', 1, withCode),
        { type: 'room:error', rid, roomId: 'room1', code },
        NOW
      ).phase

    expect(fail(false, 'wrong-code')).toBe('code-required')
    expect(fail(true, 'wrong-code')).toBe('wrong-code')
    expect(fail(false, 'banned')).toBe('banned')
    expect(fail(false, 'forbidden')).toBe('joining')
    expect(fail(false, 'banned', 9)).toBe('joining')
  })

  it('leaves on kick, close and replacement, telling the same room from another', () => {
    const phaseAfter = (event: Parameters<typeof reduceRoomEvent>[1]) => reduceRoomEvent(joined(), event, NOW).phase

    expect(phaseAfter({ type: 'room:kicked', roomId: 'room1' })).toBe('kicked')
    expect(phaseAfter({ type: 'room:closed', roomId: 'room1' })).toBe('closed')
    expect(phaseAfter({ type: 'room:replaced', roomId: 'room1', toRoomId: 'room1' })).toBe('replaced')
    expect(phaseAfter({ type: 'room:replaced', roomId: 'room1', toRoomId: 'room2' })).toBe('moved')
    expect(phaseAfter({ type: 'room:kicked', roomId: 'other' })).toBe('joined')
  })
})

describe('room view', () => {
  it('maps server statuses onto the timer statuses the UI already draws', () => {
    const room = snapshot({
      players: [
        player('a', { status: 'inspecting' }),
        player('b', { status: 'solving' }),
        player('c', { status: 'done', online: false })
      ]
    })

    expect(toPresence(room).map((p) => [p.id, p.status, p.online])).toEqual([
      ['a', TimerStatus.INSPECTING, true],
      ['b', TimerStatus.SOLVING, true],
      ['c', TimerStatus.WAITING_NEXT_ROUND, false]
    ])
  })

  it('shapes solves for the results math: +2 added, DNF flagged, pending kept', () => {
    const room = snapshot({
      solves: [solve('ana', 1, { penalty: 'plus2' }), solve('ana', 2, { penalty: 'dnf' }), solve('ben', 1)]
    })

    const byUser = toSolvesByUser(room, { ben: { name: 'Ben', image: 'b.png' } })

    expect(byUser.ana['1']).toMatchObject({ time: 12_000, plus2: true, dnf: false, roundIndex: 1, pending: false })
    expect(byUser.ana['2']).toMatchObject({ time: 10_000, dnf: true })
    expect(byUser.ben['1']).toMatchObject({ time: 10_000, pending: true, userName: 'Ben', userImage: 'b.png' })
  })
})

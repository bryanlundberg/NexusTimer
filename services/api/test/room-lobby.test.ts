import type { RoomSummary } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { createRoomLobby } from '../src/modules/rooms/lobby.store'
import { fakeRedis } from './fake-redis'
import { buildTestApp } from './helpers'

const summary = (roomId: string, createdAt: number, players = 1): RoomSummary => ({
  roomId,
  name: `Sala ${roomId}`,
  event: '3x3',
  private: false,
  maxRoundTime: 60,
  maxPlayers: 16,
  createdAt,
  roundDeadline: createdAt + 60_000,
  players: Array.from({ length: players }, (_, i) => ({ userId: `u${i}`, name: `Player ${i}`, image: null }))
})

describe('room lobby', () => {
  it('lists the rooms the gateway wrote, newest first and only with players', async () => {
    const redis = fakeRedis()
    redis.hashes.set('rt:rooms', {
      old: JSON.stringify(summary('old', 1_000)),
      empty: JSON.stringify(summary('empty', 3_000, 0)),
      broken: '{not json',
      fresh: JSON.stringify(summary('fresh', 2_000))
    })

    const rooms = await createRoomLobby(redis.provider).list()

    expect(rooms.map((room) => room.roomId)).toEqual(['fresh', 'old'])
  })

  it('is empty when the gateway has no rooms', async () => {
    expect(await createRoomLobby(fakeRedis().provider).list()).toEqual([])
  })
})

describe('GET /api/v1/rooms', () => {
  it('serves the lobby to visitors without a session', async () => {
    const app = buildTestApp({ roomLobby: { list: () => Promise.resolve([summary('a', 1)]) } })

    const res = await app.request('/api/v1/rooms')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([summary('a', 1)])
  })

  it('answers 500 when Redis fails', async () => {
    const app = buildTestApp({ roomLobby: { list: () => Promise.reject(new Error('redis down')) } })

    expect((await app.request('/api/v1/rooms')).status).toBe(500)
  })
})

import { createHmac } from 'node:crypto'
import { compare, hash } from 'bcryptjs'
import { describe, expect, it, vi } from 'vitest'
import { createRoomPasswords, type RoomPasswords } from '../src/modules/rooms/rooms.passwords'
import { createRoomsService, type RoomsService } from '../src/modules/rooms/rooms.service'
import { buildTestApp } from './helpers'

const SECRET = 'room-signing-secret'
const ROOM = '483920'
const signature = (roomId: string) => createHmac('sha256', SECRET).update(roomId).digest('hex')

const storedHash = await hash('ABC123', 4)

function passwordsFor(rooms: Record<string, string | null>): RoomPasswords {
  return { passwordHash: async (roomId) => (roomId in rooms ? { hash: rooms[roomId]! } : null) }
}

const service = createRoomsService({
  passwords: passwordsFor({ [ROOM]: storedHash, '111111': null }),
  signingSecret: SECRET
})

describe('rooms service', () => {
  it('hashes the code in upper case so it matches however it is typed', async () => {
    expect(await compare('XYZ789', await service.hashPassword('xyz789'))).toBe(true)
  })

  it('verifies a code case-insensitively, lets rooms without a code through and reports missing rooms', async () => {
    expect(await service.verifyPassword(ROOM, 'abc123')).toBe('granted')
    expect(await service.verifyPassword(ROOM, 'ABC124')).toBe('wrong')
    expect(await service.verifyPassword('111111', 'anything')).toBe('open')
    expect(await service.verifyPassword('999999', 'ABC123')).toBe('not-found')
  })

  it('binds the auth cookie to one room with an HMAC', () => {
    const cookie = service.authCookie(ROOM)

    expect(cookie).toBe(`${ROOM}:${signature(ROOM)}`)
    expect(service.isAuthorized(ROOM, cookie)).toBe(true)
    expect(service.isAuthorized('111111', cookie)).toBe(false)
    expect(service.isAuthorized(ROOM, `${ROOM}:${signature('111111')}`)).toBe(false)
    expect(service.isAuthorized(ROOM, `${ROOM}:zz`)).toBe(false)
    expect(service.isAuthorized(ROOM, ROOM)).toBe(false)
    expect(service.isAuthorized(ROOM, undefined)).toBe(false)
  })

  it('never authorizes or signs without a secret', () => {
    const unsigned = createRoomsService({ passwords: passwordsFor({}) })

    expect(unsigned.isAuthorized(ROOM, `${ROOM}:${signature(ROOM)}`)).toBe(false)
    expect(() => unsigned.authCookie(ROOM)).toThrow(/ROOM_SIGNING_SECRET/)
  })
})

describe('room passwords', () => {
  it('reads the hash from the realtime database with the room id encoded', async () => {
    const urls: string[] = []
    const request = (async (url: string) => {
      urls.push(url)
      if (url.includes('missing')) return new Response('nope', { status: 404 })
      return Response.json(url.includes('open') ? null : 'hash-value')
    }) as unknown as typeof fetch
    const passwords = createRoomPasswords('https://db.firebaseio.test/', request)

    expect(await passwords.passwordHash(ROOM)).toEqual({ hash: 'hash-value' })
    expect(await passwords.passwordHash('open')).toEqual({ hash: null })
    expect(await passwords.passwordHash('missing')).toBeNull()
    await passwords.passwordHash('../users')
    expect(urls).toEqual([
      `https://db.firebaseio.test/rooms/${ROOM}/passwordHash.json`,
      'https://db.firebaseio.test/rooms/open/passwordHash.json',
      'https://db.firebaseio.test/rooms/missing/passwordHash.json',
      'https://db.firebaseio.test/rooms/..%2Fusers/passwordHash.json'
    ])
  })

  it('fails the call when the database url is missing', async () => {
    await expect(createRoomPasswords(undefined).passwordHash(ROOM)).rejects.toThrow(/FIREBASE_DATABASE_URL/)
  })
})

describe('rooms routes', () => {
  const post = (body: unknown) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
  const app = buildTestApp({ rooms: service })

  it('needs no session and hashes a code', async () => {
    const res = await app.request('/api/v1/rooms/hash-password', post({ password: 'abc123' }))
    const { hash: hashed } = (await res.json()) as { hash: string }

    expect(res.status).toBe(200)
    expect(await compare('ABC123', hashed)).toBe(true)
    expect((await app.request('/api/v1/rooms/hash-password', post({ password: '' }))).status).toBe(400)
  })

  it('answers the verify outcomes with the v1 bodies', async () => {
    const missing = await app.request('/api/v1/rooms/verify-password', post({ roomId: '999999', password: 'ABC123' }))
    const wrong = await app.request('/api/v1/rooms/verify-password', post({ roomId: ROOM, password: 'NOPE00' }))
    const open = await app.request('/api/v1/rooms/verify-password', post({ roomId: '111111', password: 'X' }))
    const invalid = await app.request('/api/v1/rooms/verify-password', post({ roomId: ROOM }))

    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'Room not found' })
    expect(wrong.status).toBe(401)
    expect(await wrong.json()).toEqual({ success: false })
    expect(await open.json()).toEqual({ success: true })
    expect(open.headers.get('set-cookie')).toBeNull()
    expect(invalid.status).toBe(400)
  })

  it('sets the http-only room cookie on a correct code and accepts it back', async () => {
    const granted = await app.request('/api/v1/rooms/verify-password', post({ roomId: ROOM, password: 'abc123' }))
    const cookie = granted.headers.get('set-cookie')!

    expect(await granted.json()).toEqual({ success: true })
    expect(cookie).toBe(
      `rooms_auth=${encodeURIComponent(`${ROOM}:${signature(ROOM)}`)}; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax`
    )

    const check = await app.request(`/api/v1/rooms/check-auth?roomId=${ROOM}`, {
      headers: { cookie: cookie.split(';')[0]! }
    })
    expect(await check.json()).toEqual({ authorized: true })
  })

  it('accepts a cookie written by the Next.js handler', async () => {
    const nextCookie = `rooms_auth=${encodeURIComponent(`${ROOM}:${signature(ROOM)}`)}`

    const res = await app.request(`/api/v1/rooms/check-auth?roomId=${ROOM}`, { headers: { cookie: nextCookie } })

    expect(await res.json()).toEqual({ authorized: true })
  })

  it('checks auth for the asked room only and needs a room id', async () => {
    const cookie = `rooms_auth=${encodeURIComponent(`${ROOM}:${signature(ROOM)}`)}`

    const other = await app.request('/api/v1/rooms/check-auth?roomId=111111', { headers: { cookie } })
    const none = await app.request(`/api/v1/rooms/check-auth?roomId=${ROOM}`)
    const missing = await app.request('/api/v1/rooms/check-auth')

    expect(await other.json()).toEqual({ authorized: false })
    expect(await none.json()).toEqual({ authorized: false })
    expect(missing.status).toBe(400)
    expect(await missing.json()).toEqual({ message: 'Missing roomId' })
  })

  it('answers 500 when the database cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const failing: RoomsService = { ...service, verifyPassword: () => Promise.reject(new Error('timeout')) }

    const res = await buildTestApp({ rooms: failing }).request(
      '/api/v1/rooms/verify-password',
      post({ roomId: ROOM, password: 'ABC123' })
    )

    expect(res.status).toBe(500)
  })
})

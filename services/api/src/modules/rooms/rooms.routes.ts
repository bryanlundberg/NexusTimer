import {
  type HashRoomPasswordResponse,
  hashRoomPasswordSchema,
  type RoomAuthResponse,
  type VerifyRoomPasswordResponse,
  verifyRoomPasswordSchema
} from '@nexustimer/contracts'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { serialize } from 'hono/utils/cookie'
import { badRequest, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { RoomsService } from './rooms.service'

export const ROOMS_AUTH_COOKIE = 'rooms_auth'
const ROOMS_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24

export function roomsRoutes(rooms: RoomsService) {
  return new Hono<AppEnv>()
    .get('/check-auth', (c) => {
      const roomId = c.req.query('roomId')
      if (!roomId) return badRequest('Missing roomId')
      return ok<RoomAuthResponse>({ authorized: rooms.isAuthorized(roomId, getCookie(c, ROOMS_AUTH_COOKIE)) })
    })
    .post('/hash-password', async (c) => {
      const body = await parseJson(c.req.raw, hashRoomPasswordSchema)
      if (body instanceof Response) return body

      try {
        return ok<HashRoomPasswordResponse>({ hash: await rooms.hashPassword(body.password) })
      } catch (error) {
        return serverError('rooms/hash-password:POST', error)
      }
    })
    .post('/verify-password', async (c) => {
      const body = await parseJson(c.req.raw, verifyRoomPasswordSchema)
      if (body instanceof Response) return body

      try {
        const result = await rooms.verifyPassword(body.roomId, body.password)
        if (result === 'not-found') return notFound('Room not found')
        if (result === 'wrong')
          return Response.json({ success: false } satisfies VerifyRoomPasswordResponse, { status: 401 })

        const res = ok<VerifyRoomPasswordResponse>({ success: true })
        if (result === 'granted') {
          // One cookie for the last room joined; a new room overwrites it.
          const cookie = serialize(ROOMS_AUTH_COOKIE, rooms.authCookie(body.roomId), {
            httpOnly: true,
            sameSite: 'Lax',
            path: '/',
            maxAge: ROOMS_AUTH_MAX_AGE_SECONDS
          })
          res.headers.append('set-cookie', cookie)
        }
        return res
      } catch (error) {
        return serverError('rooms/verify-password:POST', error)
      }
    })
}

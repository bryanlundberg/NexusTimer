import { createHmac, timingSafeEqual } from 'node:crypto'
import { compare, hash } from 'bcryptjs'
import type { RoomPasswords } from './rooms.passwords'

const ROOM_PASSWORD_ROUNDS = 10

export type VerifyResult = 'not-found' | 'open' | 'wrong' | 'granted'

export type RoomsService = {
  hashPassword(password: string): Promise<string>
  verifyPassword(roomId: string, password: string): Promise<VerifyResult>
  authCookie(roomId: string): string
  isAuthorized(roomId: string, cookie: string | undefined): boolean
}

type RoomsDeps = { passwords: RoomPasswords; signingSecret?: string }

export function createRoomsService({ passwords, signingSecret }: RoomsDeps): RoomsService {
  function sign(roomId: string) {
    if (!signingSecret) throw new Error('ROOM_SIGNING_SECRET is not configured')
    return createHmac('sha256', signingSecret).update(roomId).digest('hex')
  }

  return {
    hashPassword: (password) => hash(password.toUpperCase(), ROOM_PASSWORD_ROUNDS),

    async verifyPassword(roomId, password) {
      const stored = await passwords.passwordHash(roomId)
      if (!stored) return 'not-found'
      if (!stored.hash) return 'open'
      return (await compare(password.toUpperCase(), stored.hash)) ? 'granted' : 'wrong'
    },

    authCookie: (roomId) => `${roomId}:${sign(roomId)}`,

    isAuthorized(roomId, cookie) {
      if (!cookie) return false
      const [storedRoomId, storedSignature] = cookie.split(':')
      if (storedRoomId !== roomId || !storedSignature) return false

      try {
        return timingSafeEqual(Buffer.from(storedSignature, 'hex'), Buffer.from(sign(roomId), 'hex'))
      } catch {
        return false
      }
    }
  }
}

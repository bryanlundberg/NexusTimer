import { z } from 'zod'

export const hashRoomPasswordSchema = z.object({ password: z.string().min(1) })

export const verifyRoomPasswordSchema = z.object({ roomId: z.string().min(1), password: z.string().min(1) })

export type HashRoomPasswordResponse = { hash: string }

export type VerifyRoomPasswordResponse = { success: boolean }

export type RoomAuthResponse = { authorized: boolean }

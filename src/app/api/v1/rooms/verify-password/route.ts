import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { signRoomId } from '@/shared/lib/rooms/sign-room-id'
import { parseJsonBody } from '@/shared/api/parse-json'
import { notFound, serverError } from '@/shared/api/responses'

const verifyBodySchema = z.object({
  roomId: z.string().min(1),
  password: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request, verifyBodySchema)
    if (body instanceof Response) return body

    const { roomId, password } = body
    const firebaseUrl = `${process.env.NEXT_PUBLIC_REALTIME}/rooms/${roomId}/passwordHash.json`
    const res = await fetch(firebaseUrl)
    if (!res.ok) return notFound('Room not found')

    const storedHash: string | null = await res.json()
    if (!storedHash) {
      return NextResponse.json({ success: true })
    }

    if (!(await bcrypt.compare(password.toUpperCase(), storedHash))) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    // Correct — store roomId:signature in a single HttpOnly cookie (overwrites any previous room)
    const response = NextResponse.json({ success: true })
    response.cookies.set('rooms_auth', `${roomId}:${signRoomId(roomId)}`, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24h
    })
    return response
  } catch (error) {
    return serverError('rooms/verify-password:POST', error)
  }
}

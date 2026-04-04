import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text.toUpperCase()).digest('hex')
}

function signRoomId(roomId: string): string {
  return crypto
    .createHmac('sha256', process.env.NEXTAUTH_SECRET || '')
    .update(roomId)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, password } = await request.json()
    if (!roomId || !password) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const firebaseUrl = `${process.env.NEXT_PUBLIC_REALTIME}/rooms/${roomId}/passwordHash.json`
    const res = await fetch(firebaseUrl)
    if (!res.ok) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const storedHash: string | null = await res.json()
    if (!storedHash) {
      return NextResponse.json({ success: true })
    }

    if (sha256(password) !== storedHash) {
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
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

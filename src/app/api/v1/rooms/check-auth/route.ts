import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { cookies } from 'next/headers'

function signRoomId(roomId: string): string {
  return crypto
    .createHmac('sha256', process.env.NEXTAUTH_SECRET || '')
    .update(roomId)
    .digest('hex')
}

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId')
    if (!roomId) {
      return NextResponse.json({ error: 'Missing roomId' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const cookieValue = cookieStore.get('rooms_auth')?.value

    if (!cookieValue) {
      return NextResponse.json({ authorized: false })
    }

    const [storedRoomId, storedSignature] = cookieValue.split(':')

    if (storedRoomId !== roomId || !storedSignature) {
      return NextResponse.json({ authorized: false })
    }

    const expectedSignature = signRoomId(roomId)
    const authorized = crypto.timingSafeEqual(
      Buffer.from(storedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )

    return NextResponse.json({ authorized })
  } catch {
    return NextResponse.json({ authorized: false })
  }
}

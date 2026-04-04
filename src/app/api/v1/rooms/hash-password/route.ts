import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password.toUpperCase(), 10)
    return NextResponse.json({ hash })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

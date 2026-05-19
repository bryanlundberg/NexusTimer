import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserCredential from '@/entities/user-credential/model/user-credential'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'
import { resend, generateVerificationCode } from '@/shared/lib/resend'

const TTL_MS = 10 * 60 * 1000

async function sendCode(email: string, name: string, code: string) {
  await resend.emails.send({
    from: 'NexusTimer <noreply@nexustimer.com>',
    to: email,
    subject: 'Verify your NexusTimer account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Hey ${name}, welcome to NexusTimer!</h2>
        <p>Enter this code to verify your account. It expires in 10 minutes.</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px 0">${code}</div>
        <p style="color:#888;font-size:0.85rem">If you didn't request this, you can ignore this email.</p>
      </div>
    `
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }

    await connectDB()

    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      const existingCredential = await UserCredential.findOne({ userId: existingUser._id }).lean()
      if (existingCredential) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
      }
    }

    const passwordHash = await hash(password, 12)
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + TTL_MS)

    await PendingRegistration.findOneAndUpdate(
      { email },
      { email, name, passwordHash, code, expiresAt },
      { upsert: true, new: true }
    )

    await sendCode(email, name, code)

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

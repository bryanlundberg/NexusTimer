import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'
import { resend, generateVerificationCode } from '@/shared/lib/resend'

const TTL_MS = 10 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 })
    }

    await connectDB()

    const pending = await PendingRegistration.findOne({ email })
    if (!pending) {
      return NextResponse.json({ ok: true })
    }

    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + TTL_MS)

    await PendingRegistration.updateOne({ _id: pending._id }, { $set: { code, expiresAt } })

    await resend.emails.send({
      from: 'NexusTimer <noreply@nexustimer.com>',
      to: email,
      subject: 'Your new NexusTimer code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2>Hey ${pending.name}, here's your new code!</h2>
          <p>Enter this code to verify your account. It expires in 10 minutes.</p>
          <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px 0">${code}</div>
          <p style="color:#888;font-size:0.85rem">If you didn't request this, you can ignore this email.</p>
        </div>
      `
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[resend-verification]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

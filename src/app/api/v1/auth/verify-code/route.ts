import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserCredential from '@/entities/user-credential/model/user-credential'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body.email as string
    const code = String(body.code)

    if (!email || !code) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const pending = await PendingRegistration.findOne({ email, code })
    if (!pending) {
      return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 })
    }

    if (pending.expiresAt < new Date()) {
      await PendingRegistration.deleteOne({ _id: pending._id })
      return NextResponse.json({ message: 'Code expired, request a new one' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      const existingCredential = await UserCredential.findOne({ userId: existingUser._id })
      if (existingCredential) {
        await PendingRegistration.deleteOne({ _id: pending._id })
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
      }

      await UserCredential.create({ userId: existingUser._id, passwordHash: pending.passwordHash })
      await User.updateOne(
        { _id: existingUser._id },
        { $addToSet: { providers: { provider: 'credentials', providerId: email } } }
      )
    } else {
      const image = `https://ui-avatars.com/api/?name=${pending.name.replace(/\s+/g, '+')}&background=random&size=128`

      const newUser = await User.create({
        email,
        name: pending.name,
        image,
        providers: [{ provider: 'credentials', providerId: email }]
      })

      const credError = await UserCredential.create({ userId: newUser._id, passwordHash: pending.passwordHash }).then(
        () => null,
        async (err: Error) => {
          await User.deleteOne({ _id: newUser._id })
          return err
        }
      )
      if (credError) return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    await PendingRegistration.deleteOne({ _id: pending._id })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[verify-code]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

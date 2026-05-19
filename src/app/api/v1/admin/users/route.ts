import { NextRequest, NextResponse } from 'next/server'
import { Model, Types } from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Backup from '@/entities/backup/model/backup'
import Solve from '@/entities/solve/model/solve'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import TrainerLearned from '@/entities/trainer-learned/model/trainer-learned'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import Feedback from '@/entities/feedback/model/feedback'
import UserCredential from '@/entities/user-credential/model/user-credential'
import EmailVerification from '@/entities/email-verification/model/email-verification'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'
import PasswordResetToken from '@/entities/password-reset-token/model/password-reset-token'

type RelatedCollection = {
  key: string
  model: Model<any>
  filter: (ctx: { userId: Types.ObjectId; email: string }) => Record<string, unknown>
}

const RELATED_COLLECTIONS: RelatedCollection[] = [
  { key: 'solves', model: Solve, filter: ({ userId }) => ({ user: userId }) },
  { key: 'backups', model: Backup, filter: ({ userId }) => ({ user: userId }) },
  { key: 'trainerSolves', model: TrainerSolve, filter: ({ userId }) => ({ user: userId }) },
  { key: 'trainerLearned', model: TrainerLearned, filter: ({ userId }) => ({ user: userId }) },
  { key: 'trainerStats', model: TrainerStats, filter: ({ userId }) => ({ user: userId }) },
  { key: 'feedback', model: Feedback, filter: ({ userId }) => ({ userId }) },
  { key: 'credentials', model: UserCredential, filter: ({ userId }) => ({ userId }) },
  { key: 'emailVerifications', model: EmailVerification, filter: ({ userId }) => ({ userId }) },
  { key: 'passwordResetTokens', model: PasswordResetToken, filter: ({ userId }) => ({ userId }) },
  { key: 'pendingRegistrations', model: PendingRegistration, filter: ({ email }) => ({ email }) }
]

function unauthorized(request: NextRequest) {
  const expected = process.env.ADMIN_TOKEN
  const token = request.headers.get('x-admin-token')
  return !expected || !token || token !== expected
}

function parseEmail(request: NextRequest) {
  return request.nextUrl.searchParams.get('email')?.trim().toLowerCase() || null
}

async function deleteUploadthingFile(url: string) {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await fetch(`${base}/api/uploadthing`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
  } catch (error) {
    console.error('Error deleting UploadThing file:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    if (unauthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = parseEmail(request)
    if (!email) return NextResponse.json({ error: 'email query param is required' }, { status: 400 })

    await connectDB()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const ctx = { userId: user._id, email }
    const counts = Object.fromEntries(
      await Promise.all(RELATED_COLLECTIONS.map(async (c) => [c.key, await c.model.countDocuments(c.filter(ctx))]))
    )

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        hasBackupFile: Boolean(user.backup?.url)
      },
      counts
    })
  } catch (error) {
    console.error('Error previewing user deletion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (unauthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const email = parseEmail(request)
    if (!email) return NextResponse.json({ error: 'email query param is required' }, { status: 400 })

    await connectDB()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user.backup?.url) await deleteUploadthingFile(user.backup.url)

    const ctx = { userId: user._id, email }
    const deleted = Object.fromEntries(
      await Promise.all(
        RELATED_COLLECTIONS.map(async (c) => {
          const result = await c.model.deleteMany(c.filter(ctx))
          return [c.key, result.deletedCount]
        })
      )
    )

    await User.deleteOne({ _id: user._id })

    return NextResponse.json({
      deleted: { user: { _id: user._id, email }, ...deleted }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest } from 'next/server'
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
import Session from '@/entities/session/model/session'
import { sessionCache } from '@/shared/lib/session-cache'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseEmailParam } from '@/shared/api/admin-helpers'
import { badRequest, notFound, ok, serverError } from '@/shared/api/responses'

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
  { key: 'pendingRegistrations', model: PendingRegistration, filter: ({ email }) => ({ email }) },
  { key: 'sessions', model: Session, filter: ({ userId }) => ({ userId }) }
]

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
    const denied = requireAdmin(request)
    if (denied) return denied

    const email = parseEmailParam(request)
    if (!email) return badRequest('email query param is required')

    await connectDB()
    const user = await User.findOne({ email })
    if (!user) return notFound('User not found')

    const ctx = { userId: user._id, email }
    const counts = Object.fromEntries(
      await Promise.all(RELATED_COLLECTIONS.map(async (c) => [c.key, await c.model.countDocuments(c.filter(ctx))]))
    )

    return ok({
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
    return serverError('admin/users:GET', error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const denied = requireAdmin(request)
    if (denied) return denied

    const email = parseEmailParam(request)
    if (!email) return badRequest('email query param is required')

    await connectDB()
    const user = await User.findOne({ email })
    if (!user) return notFound('User not found')

    if (user.backup?.url) await deleteUploadthingFile(user.backup.url)

    const userSessions = await Session.find({ userId: user._id }, { sessionId: 1 }).lean<{ sessionId: string }[]>()
    await Promise.all(userSessions.map((s) => sessionCache.invalidate(s.sessionId)))

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

    return ok({
      deleted: { user: { _id: user._id, email }, ...deleted }
    })
  } catch (error) {
    return serverError('admin/users:DELETE', error)
  }
}

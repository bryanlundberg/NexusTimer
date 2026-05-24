import { hash } from 'bcryptjs'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserCredential from '@/entities/user-credential/model/user-credential'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'
import { AuthError } from './auth-error'
import { generateVerificationCode, getVerificationExpiry } from './verification-code'
import { sendVerificationEmail } from './verification-email'
import { sendWelcomeEmail } from './welcome-email'
import Log, { LogType } from '@/entities/log/model/log'

const PASSWORD_HASH_ROUNDS = 12

interface CreatePendingRegistrationArgs {
  email: string
  name: string
  password: string
}

export async function createPendingRegistration({ email, name, password }: CreatePendingRegistrationArgs) {
  await connectDB()
  await assertEmailAvailable(email)

  const passwordHash = await hash(password, PASSWORD_HASH_ROUNDS)
  const code = generateVerificationCode()
  const expiresAt = getVerificationExpiry()

  await PendingRegistration.findOneAndUpdate(
    { email },
    { email, name, passwordHash, code, expiresAt },
    { upsert: true, new: true }
  )

  await sendVerificationEmail({ email, name, code })
}

export async function refreshPendingCode(email: string) {
  await connectDB()

  const pending = await PendingRegistration.findOne({ email })
  if (!pending) return

  const code = generateVerificationCode()
  const expiresAt = getVerificationExpiry()

  await PendingRegistration.updateOne({ _id: pending._id }, { $set: { code, expiresAt } })

  await sendVerificationEmail({ email, name: pending.name, code, isResend: true })
}

interface ConfirmRegistrationArgs {
  email: string
  code: string
}

export async function confirmRegistration({ email, code }: ConfirmRegistrationArgs) {
  await connectDB()

  const pending = await PendingRegistration.findOne({ email, code })
  if (!pending) {
    throw new AuthError('invalid-or-expired-code', 'Invalid or expired code')
  }

  if (pending.expiresAt < new Date()) {
    await PendingRegistration.deleteOne({ _id: pending._id })
    throw new AuthError('code-expired', 'Code expired, request a new one')
  }

  try {
    await upsertUserWithCredentials({
      email,
      name: pending.name,
      passwordHash: pending.passwordHash
    })
  } finally {
    await PendingRegistration.deleteOne({ _id: pending._id })
  }
}

async function assertEmailAvailable(email: string) {
  const existingUser = await User.findOne({ email }).lean()
  if (!existingUser) return

  const existingCredential = await UserCredential.findOne({ userId: existingUser._id }).lean()
  if (existingCredential) {
    throw new AuthError('email-in-use', 'Email already in use')
  }
}

interface UpsertUserArgs {
  email: string
  name: string
  passwordHash: string
}

async function upsertUserWithCredentials({ email, name, passwordHash }: UpsertUserArgs) {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    const existingCredential = await UserCredential.findOne({ userId: existingUser._id })
    if (existingCredential) {
      throw new AuthError('email-in-use', 'Email already in use')
    }

    await UserCredential.create({ userId: existingUser._id, passwordHash })
    await User.updateOne(
      { _id: existingUser._id },
      { $addToSet: { providers: { provider: 'credentials', providerId: email } } }
    )
    return
  }

  const image = buildAvatarUrl(name)

  const newUser = await User.create({
    email,
    name,
    image,
    providers: [{ provider: 'credentials', providerId: email }]
  })

  try {
    await UserCredential.create({ userId: newUser._id, passwordHash })
  } catch (err) {
    await User.deleteOne({ _id: newUser._id })
    throw err
  }

  sendWelcomeEmail({ email, name }).catch(async (err) => {
    try {
      await Log.create({
        type: LogType.ApiError,
        message: err instanceof Error ? err.message : String(err),
        metadata: {
          source: 'welcome-email',
          email,
          stack: err instanceof Error ? err.stack : undefined
        }
      })
    } catch (logErr) {
      console.error('Failed to log welcome email error:', logErr)
    }
  })
}

function buildAvatarUrl(name: string): string {
  const encoded = name.replace(/\s+/g, '+')
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128`
}

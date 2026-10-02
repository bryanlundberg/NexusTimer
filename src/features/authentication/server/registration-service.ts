import connectDB from '@/shared/config/mongodb/mongodb'
import PendingRegistration from '@/entities/pending-registration/model/pending-registration'
import { auth } from '@/shared/config/auth/auth'
import { hashPassword } from '@/shared/config/auth/password'
import { AuthError } from './auth-error'
import { generateVerificationCode, getVerificationExpiry } from './verification-code'
import { sendVerificationEmail } from './verification-email'

const CREDENTIAL_PROVIDER_ID = 'credential'

interface CreatePendingRegistrationArgs {
  email: string
  name: string
  password: string
}

export async function createPendingRegistration({ email, name, password }: CreatePendingRegistrationArgs) {
  await connectDB()
  await assertEmailAvailable(email)

  const passwordHash = await hashPassword(password)
  const code = generateVerificationCode()
  const expiresAt = getVerificationExpiry()

  await PendingRegistration.findOneAndUpdate(
    { email },
    { email, name, passwordHash, code, expiresAt },
    { upsert: true, returnDocument: 'after' }
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
  const { internalAdapter } = await auth.$context
  const existing = await internalAdapter.findUserByEmail(email, { includeAccounts: true })
  if (existing?.accounts.some((account) => account.providerId === CREDENTIAL_PROVIDER_ID)) {
    throw new AuthError('email-in-use', 'Email already in use')
  }
}

interface UpsertUserArgs {
  email: string
  name: string
  passwordHash: string
}

async function upsertUserWithCredentials({ email, name, passwordHash }: UpsertUserArgs) {
  const { internalAdapter } = await auth.$context
  const existing = await internalAdapter.findUserByEmail(email, { includeAccounts: true })

  if (existing) {
    if (existing.accounts.some((account) => account.providerId === CREDENTIAL_PROVIDER_ID)) {
      throw new AuthError('email-in-use', 'Email already in use')
    }

    const userId = existing.user.id
    await internalAdapter.linkAccount({
      userId,
      providerId: CREDENTIAL_PROVIDER_ID,
      accountId: userId,
      password: passwordHash
    })
    if (!existing.user.emailVerified) await internalAdapter.updateUser(userId, { emailVerified: true })
    return
  }

  const user = await internalAdapter.createUser({ email, name, emailVerified: true }, { method: 'email-password' })

  try {
    await internalAdapter.linkAccount({
      userId: user.id,
      providerId: CREDENTIAL_PROVIDER_ID,
      accountId: user.id,
      password: passwordHash
    })
  } catch (err) {
    await internalAdapter.deleteUser(user.id)
    throw err
  }
}

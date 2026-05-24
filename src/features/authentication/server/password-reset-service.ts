import { hash } from 'bcryptjs'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import UserCredential from '@/entities/user-credential/model/user-credential'
import PasswordResetToken from '@/entities/password-reset-token/model/password-reset-token'
import { AuthError } from './auth-error'
import { generateOobCode, getPasswordResetExpiry } from './password-reset-token-utils'
import { sendPasswordResetEmail } from './password-reset-email'

const PASSWORD_HASH_ROUNDS = 12

function getAppBaseUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

export async function requestPasswordReset(email: string): Promise<void> {
  await connectDB()

  const user = await User.findOne({ email })
  if (!user) return

  const credential = await UserCredential.findOne({ userId: user._id })
  if (!credential) return

  const oobCode = generateOobCode()
  const expiresAt = getPasswordResetExpiry()

  await PasswordResetToken.create({ userId: user._id, oobCode, expiresAt })

  const resetUrl = `${getAppBaseUrl()}/reset-password?oobCode=${oobCode}`
  await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl })
}

export async function validateResetToken(oobCode: string): Promise<{ email: string }> {
  await connectDB()

  const token = await PasswordResetToken.findOne({ oobCode })
  if (!token) {
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  if (token.expiresAt < new Date()) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  const user = await User.findById(token.userId).lean<{ email: string } | null>()
  if (!user) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  return { email: user.email }
}

interface ResetPasswordArgs {
  oobCode: string
  password: string
}

export async function resetPassword({ oobCode, password }: ResetPasswordArgs): Promise<{ email: string }> {
  await connectDB()

  const token = await PasswordResetToken.findOne({ oobCode })
  if (!token) {
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  if (token.expiresAt < new Date()) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  const user = await User.findById(token.userId).lean<{ email: string } | null>()
  if (!user) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  const passwordHash = await hash(password, PASSWORD_HASH_ROUNDS)
  await UserCredential.updateOne({ userId: token.userId }, { $set: { passwordHash } })
  await PasswordResetToken.deleteOne({ _id: token._id })

  return { email: user.email }
}

import connectDB from '@/shared/config/mongodb/mongodb'
import PasswordResetToken from '@/entities/password-reset-token/model/password-reset-token'
import { auth } from '@/shared/config/auth/auth'
import { hashPassword } from '@/shared/config/auth/password'
import { appUrl } from '@/shared/lib/app-url'
import { AuthError } from './auth-error'
import { generateOobCode, getPasswordResetExpiry } from './password-reset-token-utils'
import { sendPasswordResetEmail } from './password-reset-email'

export async function requestPasswordReset(email: string): Promise<void> {
  await connectDB()
  const { internalAdapter } = await auth.$context

  const existing = await internalAdapter.findUserByEmail(email)
  if (!existing) return

  const credential = await internalAdapter.findCredentialAccount(existing.user.id)
  if (!credential) return

  const oobCode = generateOobCode()
  const expiresAt = getPasswordResetExpiry()

  await PasswordResetToken.create({ userId: existing.user.id, oobCode, expiresAt })

  const resetUrl = `${appUrl()}/reset-password?oobCode=${oobCode}`
  await sendPasswordResetEmail({ email: existing.user.email, name: existing.user.name, resetUrl })
}

async function findValidToken(oobCode: string) {
  const token = await PasswordResetToken.findOne({ oobCode })
  if (!token) {
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  if (token.expiresAt < new Date()) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  const { internalAdapter } = await auth.$context
  const user = await internalAdapter.findUserById(token.userId.toString())
  if (!user) {
    await PasswordResetToken.deleteOne({ _id: token._id })
    throw new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')
  }

  return { token, user }
}

export async function validateResetToken(oobCode: string): Promise<{ email: string }> {
  await connectDB()
  const { user } = await findValidToken(oobCode)
  return { email: user.email }
}

interface ResetPasswordArgs {
  oobCode: string
  password: string
}

export async function resetPassword({ oobCode, password }: ResetPasswordArgs): Promise<{ email: string }> {
  await connectDB()
  const { token, user } = await findValidToken(oobCode)
  const { internalAdapter } = await auth.$context

  await internalAdapter.updatePassword(user.id, await hashPassword(password))
  await internalAdapter.deleteUserSessions(user.id)
  await PasswordResetToken.deleteOne({ _id: token._id })

  return { email: user.email }
}

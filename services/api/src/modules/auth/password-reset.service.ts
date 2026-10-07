import { createHash, randomBytes } from 'node:crypto'
import type { ResetPasswordRequest } from '@nexustimer/contracts'
import type { Mailer } from '../../infra/mail'
import type { AccountStore } from './auth.accounts'
import { passwordResetEmail } from './auth.emails'
import { AuthError } from './auth.errors'
import type { AuthRepository } from './auth.repository'

export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000

export type PasswordResetService = {
  request(email: string): Promise<void>
  validate(oobCode: string): Promise<{ email: string }>
  reset(request: ResetPasswordRequest): Promise<{ email: string }>
}

type PasswordResetDeps = {
  accounts: AccountStore
  repository: AuthRepository
  mail: Mailer
  hashPassword: (password: string) => Promise<string>
  appUrl: string
  now?: () => number
}

const invalidToken = () => new AuthError('invalid-or-expired-token', 'Invalid or expired reset link')

const hashToken = (oobCode: string) => createHash('sha256').update(oobCode).digest('hex')

export function createPasswordResetService({
  accounts,
  repository,
  mail,
  hashPassword,
  appUrl,
  now = Date.now
}: PasswordResetDeps): PasswordResetService {
  async function findValidToken(oobCode: string) {
    const token = await repository.findResetToken(hashToken(oobCode))
    if (!token) throw invalidToken()

    if (token.expiresAt.getTime() < now()) {
      await repository.deleteResetToken(token.id)
      throw invalidToken()
    }

    const user = await accounts.findById(token.userId)
    if (!user) {
      await repository.deleteResetToken(token.id)
      throw invalidToken()
    }

    return { token, user }
  }

  return {
    async request(email) {
      const existing = await accounts.findByEmail(email)
      if (!existing?.hasCredential) return

      const oobCode = randomBytes(32).toString('hex')
      await repository.deleteUserResetTokens(existing.user.id)
      await repository.createResetToken({
        userId: existing.user.id,
        tokenHash: hashToken(oobCode),
        expiresAt: new Date(now() + PASSWORD_RESET_TTL_MS)
      })

      const resetUrl = `${appUrl}/reset-password?oobCode=${oobCode}`
      await mail({ to: existing.user.email, ...passwordResetEmail({ name: existing.user.name, resetUrl }) })
    },

    async validate(oobCode) {
      const { user } = await findValidToken(oobCode)
      return { email: user.email }
    },

    async reset({ oobCode, password }) {
      const { user } = await findValidToken(oobCode)

      await accounts.updatePassword(user.id, await hashPassword(password))
      await accounts.revokeSessions(user.id)
      await repository.deleteUserResetTokens(user.id)

      return { email: user.email }
    }
  }
}

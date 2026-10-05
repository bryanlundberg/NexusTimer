import { randomInt } from 'node:crypto'
import type { RegisterRequest, VerifyCodeRequest } from '@nexustimer/contracts'
import type { Mailer } from '../../infra/mail'
import type { AccountStore } from './auth.accounts'
import { verificationEmail } from './auth.emails'
import { AuthError } from './auth.errors'
import type { AuthRepository } from './auth.repository'

export const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000

export type RegistrationService = {
  register(request: RegisterRequest): Promise<void>
  resendCode(email: string): Promise<void>
  confirm(request: VerifyCodeRequest): Promise<void>
}

type RegistrationDeps = {
  accounts: AccountStore
  repository: AuthRepository
  mail: Mailer
  hashPassword: (password: string) => Promise<string>
  now?: () => number
}

const generateCode = () => String(randomInt(100_000, 1_000_000))

const emailInUse = () => new AuthError('email-in-use', 'Email already in use')

export function createRegistrationService({
  accounts,
  repository,
  mail,
  hashPassword,
  now = Date.now
}: RegistrationDeps): RegistrationService {
  const expiry = () => new Date(now() + VERIFICATION_CODE_TTL_MS)

  async function createUserWithCredential(email: string, name: string, passwordHash: string) {
    const existing = await accounts.findByEmail(email)

    if (existing) {
      if (existing.hasCredential) throw emailInUse()
      await accounts.linkCredential(existing.user.id, passwordHash)
      if (!existing.user.emailVerified) await accounts.markEmailVerified(existing.user.id)
      return
    }

    const user = await accounts.createUser({ email, name })
    try {
      await accounts.linkCredential(user.id, passwordHash)
    } catch (error) {
      await accounts.deleteUser(user.id)
      throw error
    }
  }

  return {
    async register({ email, name, password }) {
      if ((await accounts.findByEmail(email))?.hasCredential) throw emailInUse()

      const passwordHash = await hashPassword(password)
      const code = generateCode()
      await repository.savePendingRegistration({ email, name, passwordHash, code, expiresAt: expiry() })
      await mail({ to: email, ...verificationEmail({ name, code }) })
    },

    async resendCode(email) {
      const pending = await repository.findPendingRegistration(email)
      if (!pending) return

      const code = generateCode()
      await repository.updatePendingCode(pending.id, code, expiry())
      await mail({ to: email, ...verificationEmail({ name: pending.name, code, isResend: true }) })
    },

    async confirm({ email, code }) {
      const pending = await repository.findPendingRegistration(email, code)
      if (!pending) throw new AuthError('invalid-or-expired-code', 'Invalid or expired code')

      if (pending.expiresAt.getTime() < now()) {
        await repository.deletePendingRegistration(pending.id)
        throw new AuthError('code-expired', 'Code expired, request a new one')
      }

      try {
        await createUserWithCredential(email, pending.name, pending.passwordHash)
      } finally {
        await repository.deletePendingRegistration(pending.id)
      }
    }
  }
}

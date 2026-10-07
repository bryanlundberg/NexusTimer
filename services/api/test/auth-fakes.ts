import type { Mail } from '../src/infra/mail'
import type { AccountStore, AccountUser } from '../src/modules/auth/auth.accounts'
import type { AuthRepository, PasswordResetToken, PendingRegistration } from '../src/modules/auth/auth.repository'

type StoredAccount = { user: AccountUser; passwordHash?: string; sessions: number }

export function fakeAccounts() {
  const users = new Map<string, StoredAccount>()
  let nextId = 1

  const store: AccountStore = {
    async findByEmail(email) {
      const found = [...users.values()].find(({ user }) => user.email === email)
      return found ? { user: found.user, hasCredential: found.passwordHash !== undefined } : null
    },
    async findById(userId) {
      return users.get(userId)?.user ?? null
    },
    async createUser({ email, name }) {
      const user = { id: `user-${nextId++}`, email, name, emailVerified: true }
      users.set(user.id, { user, sessions: 0 })
      return user
    },
    async deleteUser(userId) {
      users.delete(userId)
    },
    async authRecords(userId) {
      const account = users.get(userId)
      return { accounts: account ? 1 : 0, authSessions: account?.sessions ?? 0 }
    },
    async markEmailVerified(userId) {
      const account = users.get(userId)
      if (account) account.user = { ...account.user, emailVerified: true }
    },
    async linkCredential(userId, passwordHash) {
      const account = users.get(userId)
      if (account) account.passwordHash = passwordHash
    },
    async updatePassword(userId, passwordHash) {
      const account = users.get(userId)
      if (account) account.passwordHash = passwordHash
    },
    async revokeSessions(userId) {
      const account = users.get(userId)
      if (account) account.sessions = 0
    }
  }

  function add(user: Omit<AccountUser, 'id'> & { passwordHash?: string; sessions?: number }) {
    const { passwordHash, sessions = 0, ...fields } = user
    const stored = { user: { id: `user-${nextId++}`, ...fields }, passwordHash, sessions }
    users.set(stored.user.id, stored)
    return stored.user
  }

  return { store, users, add }
}

export function fakeRepository() {
  const pending = new Map<string, PendingRegistration>()
  const tokens = new Map<string, PasswordResetToken>()
  let nextId = 1

  const repository: AuthRepository = {
    async savePendingRegistration(registration) {
      const existing = [...pending.values()].find(({ email }) => email === registration.email)
      const id = existing?.id ?? `pending-${nextId++}`
      pending.set(id, { id, ...registration, attempts: 0 })
    },
    async recordCodeAttempt(email) {
      const entry = [...pending.values()].find((candidate) => candidate.email === email)
      if (!entry) return null
      const updated = { ...entry, attempts: entry.attempts + 1 }
      pending.set(entry.id, updated)
      return updated
    },
    async deletePendingRegistration(id) {
      pending.delete(id)
    },
    async createResetToken(token) {
      const id = `token-${nextId++}`
      tokens.set(id, { id, ...token })
    },
    async findResetToken(tokenHash) {
      return [...tokens.values()].find((token) => token.tokenHash === tokenHash) ?? null
    },
    async deleteResetToken(id) {
      tokens.delete(id)
    },
    async deleteUserResetTokens(userId) {
      for (const [id, token] of tokens) if (token.userId === userId) tokens.delete(id)
    }
  }

  return { repository, pending, tokens }
}

export function fakeMailer() {
  const sent: Mail[] = []
  const mailer = async (mail: Mail) => {
    sent.push(mail)
  }
  return { mailer, sent }
}

export const fakeHash = async (password: string) => `hashed:${password}`

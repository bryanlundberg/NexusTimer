import type { AuthProvider } from './auth'

const CREDENTIAL_PROVIDER_ID = 'credential'

export type AccountUser = { id: string; email: string; name: string; emailVerified: boolean }
export type AccountLookup = { user: AccountUser; hasCredential: boolean }

export type AccountStore = {
  findByEmail(email: string): Promise<AccountLookup | null>
  findById(userId: string): Promise<AccountUser | null>
  createUser(user: { email: string; name: string }): Promise<AccountUser>
  deleteUser(userId: string): Promise<void>
  markEmailVerified(userId: string): Promise<void>
  linkCredential(userId: string, passwordHash: string): Promise<void>
  updatePassword(userId: string, passwordHash: string): Promise<void>
  revokeSessions(userId: string): Promise<void>
}

export function createAccountStore(getAuth: AuthProvider): AccountStore {
  const adapter = async () => (await (await getAuth()).$context).internalAdapter

  return {
    async findByEmail(email) {
      const found = await (await adapter()).findUserByEmail(email, { includeAccounts: true })
      if (!found) return null
      return {
        user: found.user,
        hasCredential: found.accounts.some((account) => account.providerId === CREDENTIAL_PROVIDER_ID)
      }
    },
    async findById(userId) {
      return (await adapter()).findUserById(userId)
    },
    async createUser({ email, name }) {
      return (await adapter()).createUser({ email, name, emailVerified: true }, { method: 'email-password' })
    },
    async deleteUser(userId) {
      await (await adapter()).deleteUser(userId)
    },
    async markEmailVerified(userId) {
      await (await adapter()).updateUser(userId, { emailVerified: true })
    },
    async linkCredential(userId, passwordHash) {
      await (
        await adapter()
      ).linkAccount({
        userId,
        providerId: CREDENTIAL_PROVIDER_ID,
        accountId: userId,
        password: passwordHash
      })
    },
    async updatePassword(userId, passwordHash) {
      await (await adapter()).updatePassword(userId, passwordHash)
    },
    async revokeSessions(userId) {
      await (await adapter()).deleteUserSessions(userId)
    }
  }
}

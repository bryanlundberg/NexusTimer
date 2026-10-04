import type { AchievementRarityInput } from '@nexustimer/contracts'
import type { Storage } from '../../infra/storage'
import type { UserDocuments, UserRef } from '../../infra/user-documents'
import { logger, serializeError } from '../../lib/logger'
import type { GrantedAchievement } from '../achievements/achievements.repository'
import type { AchievementsService } from '../achievements/achievements.service'
import type { AccountStore } from '../auth/auth.accounts'
import type { PresenceStore } from '../realtime/presence.store'
import type { SharedSolvesService } from '../shared-solves/shared-solves.service'
import type { UsersService } from '../users/users.service'

type UserIdentity = { _id: string; email: string }

export type UserAchievementsResult = { user: UserIdentity & { name: string }; achievements: GrantedAchievement[] }
export type GrantResult = { granted: GrantedAchievement; user: UserIdentity }
export type RevokeResult = { removed: { key: string; deletedCount: number }; user: UserIdentity }
export type UserSummaryResult = {
  user: UserIdentity & { name: string; createdAt: string; hasBackupFile: boolean }
  counts: Record<string, number>
}
export type DeletedUserResult = { deleted: { user: UserIdentity } & Record<string, unknown> }

export type AdminService = {
  achievements(email: string): Promise<UserAchievementsResult | null>
  grant(email: string, key: string): Promise<GrantResult | null>
  revoke(email: string, key: string): Promise<RevokeResult | null>
  saveRarity(stats: AchievementRarityInput): Promise<{ badges: number; computedAt: Date }>
  userSummary(email: string): Promise<UserSummaryResult | null>
  deleteUser(email: string): Promise<DeletedUserResult | null>
}

type AdminDeps = {
  users: Pick<UsersService, 'findByEmail' | 'forgetProfile' | 'forgetCaches'>
  achievements: Pick<AchievementsService, 'list' | 'grant' | 'revoke' | 'saveRarity'>
  userData: Record<string, UserDocuments>
  accounts: Pick<AccountStore, 'authRecords' | 'deleteUser'>
  storage: Pick<Storage, 'list' | 'delete'>
  presence: Pick<PresenceStore, 'clear'>
  sharedSolves: Pick<SharedSolvesService, 'forgetUser'>
}

export function createAdminService({
  users,
  achievements,
  userData,
  accounts,
  storage,
  presence,
  sharedSolves
}: AdminDeps): AdminService {
  async function eachUserData(action: (data: UserDocuments) => Promise<number>) {
    return Object.fromEntries(
      await Promise.all(Object.entries(userData).map(async ([key, data]) => [key, await action(data)] as const))
    )
  }

  async function removeFiles(userId: string) {
    try {
      const backups = await storage.list(`backups/${userId}/`)
      if (backups.length > 0) await storage.delete(backups.map((file) => file.key))
    } catch (error) {
      logger.error('deleting backup files failed', { userId, error: serializeError(error) })
    }
    try {
      await storage.delete(`avatars/${userId}`)
    } catch (error) {
      logger.error('deleting avatar file failed', { userId, error: serializeError(error) })
    }
  }

  return {
    async achievements(email) {
      const user = await users.findByEmail(email)
      if (!user) return null
      return {
        user: { _id: user.id, email: user.email, name: user.name },
        achievements: await achievements.list(user.id)
      }
    },

    async grant(email, key) {
      const user = await users.findByEmail(email)
      if (!user) return null
      const granted = await achievements.grant(user.id, key)
      await users.forgetProfile(user.id)
      return { granted, user: { _id: user.id, email: user.email } }
    },

    async revoke(email, key) {
      const user = await users.findByEmail(email)
      if (!user) return null
      const deletedCount = await achievements.revoke(user.id, key)
      await users.forgetProfile(user.id)
      return { removed: { key, deletedCount }, user: { _id: user.id, email: user.email } }
    },

    async saveRarity(stats) {
      await achievements.saveRarity(stats)
      return { badges: Object.keys(stats.badges).length, computedAt: stats.computedAt }
    },

    async userSummary(email) {
      const user = await users.findByEmail(email)
      if (!user) return null

      const ref: UserRef = { id: user.id, email }
      const [counts, authRecords] = await Promise.all([
        eachUserData((data) => data.count(ref)),
        accounts.authRecords(user.id)
      ])
      return {
        user: {
          _id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          hasBackupFile: user.hasBackupFile
        },
        counts: { ...counts, ...authRecords }
      }
    },

    async deleteUser(email) {
      const user = await users.findByEmail(email)
      if (!user) return null

      await removeFiles(user.id)
      await presence.clear(user.id)
      await sharedSolves.forgetUser(user.id)

      const ref: UserRef = { id: user.id, email }
      const deleted = await eachUserData((data) => data.purge(ref))
      const authRecords = await accounts.authRecords(user.id)
      await accounts.deleteUser(user.id)
      await users.forgetCaches(user.id)

      return { deleted: { user: { _id: user.id, email }, ...deleted, ...authRecords } }
    }
  }
}

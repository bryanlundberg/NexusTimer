import {
  type FriendUser,
  type PrivacySettings,
  type PublicProfile,
  type PublicUser,
  resolvePrivacy,
  type UpdatePrivacyInput,
  type UpdateProfileInput,
  USER_STATS_VERSION,
  type UserProfileResponse,
  type UserStatsSummary
} from '@nexustimer/contracts'
import type { AchievementsService } from '../achievements/achievements.service'
import type { ProfileCache, StatsCache } from './users.cache'
import type { ListedUser, ProfileUpdate, StatsSnapshot, UsersRepository } from './users.repository'

export type UsersListQuery = { name: string; country: string; page: number; excludeIds: string[] }
export type MailContact = { email: string | null; privacy: PrivacySettings }

export type UsersService = {
  publicProfiles(ids: string[]): Promise<Map<string, PublicUser>>
  profile(id: string): Promise<UserProfileResponse | null>
  updateProfile(id: string, input: UpdateProfileInput): Promise<PublicProfile | null>
  list(query: UsersListQuery, perPage: number): Promise<{ users: ListedUser[]; total: number }>
  privacy(id: string): Promise<PrivacySettings>
  updatePrivacy(id: string, input: UpdatePrivacyInput): Promise<PrivacySettings>
  statsSummary(id: string): Promise<UserStatsSummary | null>
  exists(id: string): Promise<boolean>
  friendUsers(ids: string[], withProfile?: boolean): Promise<Map<string, FriendUser>>
  mailContact(id: string): Promise<MailContact | null>
}

type UsersDeps = {
  repository: UsersRepository
  profileCache: ProfileCache
  statsCache: StatsCache
  achievements: AchievementsService
}

export function buildProfileUpdate(input: Record<string, unknown>): ProfileUpdate | null {
  const $set: Record<string, unknown> = {}
  const $unset: Record<string, ''> = {}

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue
    if (value === null || (Array.isArray(value) && value.length === 0)) $unset[key] = ''
    else $set[key] = value
  }

  const update: ProfileUpdate = {}
  if (Object.keys($set).length) update.$set = $set
  if (Object.keys($unset).length) update.$unset = $unset
  return update.$set || update.$unset ? update : null
}

const isFresh = (stats: StatsSnapshot | null, backupUpdatedAt: number | undefined): stats is StatsSnapshot =>
  !!stats && stats.version === USER_STATS_VERSION && stats.backupUpdatedAt === backupUpdatedAt

export function createUsersService({ repository, profileCache, statsCache, achievements }: UsersDeps): UsersService {
  async function privacy(id: string) {
    return resolvePrivacy((await repository.privacy([id])).get(id))
  }

  async function currentBackupUpdatedAt(id: string) {
    const cached = await profileCache.get(id)
    if (cached) return cached.backup?.updatedAt
    return repository.backupUpdatedAt(id)
  }

  return {
    async publicProfiles(ids) {
      const unique = [...new Set(ids)]
      const profiles = await profileCache.getMany(unique)
      const missing = unique.filter((id) => !profiles.has(id))

      for (const user of await repository.findPublicProfiles(missing)) profiles.set(user._id, user)
      return profiles
    },

    async profile(id) {
      const cached = await profileCache.get(id)
      if (cached) return cached

      const profile = await repository.findProfile(id)
      if (!profile) return null

      const withAchievements = { ...profile, grantedAchievements: await achievements.grantedKeys(id) }
      await profileCache.set(id, withAchievements)
      return withAchievements
    },

    async updateProfile(id, input) {
      const updated = await repository.updateProfile(id, buildProfileUpdate(input))
      await profileCache.invalidate(id)
      return updated
    },

    list: ({ name, country, page, excludeIds }, perPage) =>
      repository.list({ name, country, page, excludeIds, perPage }),

    privacy,

    async updatePrivacy(id, input) {
      await repository.updatePrivacy(id, input)
      return privacy(id)
    },

    async statsSummary(id) {
      const [backupUpdatedAt, cached] = await Promise.all([currentBackupUpdatedAt(id), statsCache.get(id)])
      if (isFresh(cached, backupUpdatedAt)) return cached.summary

      const snapshot = await repository.statsSnapshot(id)
      if (!isFresh(snapshot, backupUpdatedAt)) return null

      await statsCache.set(id, snapshot)
      return snapshot.summary
    },

    exists: (id) => repository.exists(id),

    async friendUsers(ids, withProfile = false) {
      if (ids.length === 0) return new Map()
      const users = await repository.findFriendUsers(ids, withProfile)
      return new Map(users.map((user) => [user._id, user]))
    },

    async mailContact(id) {
      const contact = await repository.findContact(id)
      return contact ? { email: contact.email, privacy: resolvePrivacy(contact.privacy) } : null
    }
  }
}

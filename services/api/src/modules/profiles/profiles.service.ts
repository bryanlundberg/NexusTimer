import {
  canViewStats,
  isObjectId,
  type PublicProfile,
  resolvePrivacy,
  type SharedSolvesPage,
  type UpdateProfileInput,
  type UserLearnedResponse,
  type UserProfileResponse,
  USERS_PAGE_SIZE,
  type UsersListResponse,
  type UserStatsResponse
} from '@nexustimer/contracts'
import { EMPTY_SHARED_SOLVES_PAGE, type SharedSolvesService } from '../shared-solves/shared-solves.service'
import type { SocialService } from '../social/social.service'
import type { TrainerService } from '../trainer/trainer.service'
import type { UsersService } from '../users/users.service'

export type ProfilesListQuery = { name: string; country: string; page: number }

export type ProfilesService = {
  list(query: ProfilesListQuery, viewerId: string | null): Promise<UsersListResponse>
  profile(id: string, viewerId: string | null): Promise<UserProfileResponse | null>
  update(id: string, input: UpdateProfileInput): Promise<PublicProfile | null>
  learned(id: string, viewerId: string | null): Promise<UserLearnedResponse>
  stats(id: string, viewerId: string | null): Promise<UserStatsResponse>
  sharedSolves(id: string, viewerId: string | null, cursor: string | null): Promise<SharedSolvesPage>
}

type ProfilesDeps = {
  users: Pick<UsersService, 'profile' | 'updateProfile' | 'list' | 'privacy' | 'statsSummary'>
  social: Pick<SocialService, 'blockedEitherWay' | 'friendIds' | 'areFriends'>
  trainer: Pick<TrainerService, 'learnedSummary'>
  sharedSolves: Pick<SharedSolvesService, 'userPage'>
}

function withoutBackupUrl<T extends PublicProfile>(profile: T): T {
  const { backup, ...rest } = profile
  return { ...rest, ...(backup ? { backup: { updatedAt: backup.updatedAt } } : {}) } as T
}

export function withoutStats<T extends PublicProfile>(profile: T): T & { statsHidden: true } {
  return { ...withoutBackupUrl(profile), statsHidden: true }
}

function forViewer<T extends PublicProfile>(profile: T, viewerId: string | null, statsVisible: boolean) {
  if (profile._id === viewerId) return profile
  return statsVisible ? withoutBackupUrl(profile) : withoutStats(profile)
}

export function createProfilesService({ users, social, trainer, sharedSolves }: ProfilesDeps): ProfilesService {
  async function statsVisibleTo(ownerId: string, viewerId: string | null) {
    if (viewerId === ownerId) return true
    const { statsVisibility } = await users.privacy(ownerId)
    if (statsVisibility === 'everyone') return true
    if (statsVisibility === 'nobody' || !viewerId) return false
    return social.areFriends(viewerId, ownerId)
  }

  return {
    async list({ name, country, page }, viewerId) {
      const [hiddenIds, friendIds] = viewerId
        ? await Promise.all([social.blockedEitherWay(viewerId), social.friendIds(viewerId)])
        : [[], []]

      const { users: listed, total } = await users.list({ name, country, page, excludeIds: hiddenIds }, USERS_PAGE_SIZE)
      const friends = new Set(friendIds)
      const events = listed.map(({ profile, privacy }) =>
        forViewer(
          profile,
          viewerId,
          canViewStats(resolvePrivacy(privacy).statsVisibility, profile._id, viewerId, friends.has(profile._id))
        )
      )

      return { events, page, pages: Math.ceil(total / USERS_PAGE_SIZE), docs: total }
    },

    async profile(id, viewerId) {
      const profile = await users.profile(id)
      if (!profile) return null
      return forViewer(profile, viewerId, await statsVisibleTo(id, viewerId))
    },

    update: (id, input) => users.updateProfile(id, input),

    async learned(id, viewerId) {
      if (!isObjectId(id)) return { total: 0, methods: [] }
      if (!(await statsVisibleTo(id, viewerId))) return { total: 0, methods: [], hidden: true }
      return trainer.learnedSummary(id)
    },

    async stats(id, viewerId) {
      if (!isObjectId(id)) return { stats: null }
      if (!(await statsVisibleTo(id, viewerId))) return { stats: null, hidden: true }
      return { stats: await users.statsSummary(id) }
    },

    async sharedSolves(id, viewerId, cursor) {
      if (!isObjectId(id)) return EMPTY_SHARED_SOLVES_PAGE
      return sharedSolves.userPage(id, viewerId, cursor)
    }
  }
}

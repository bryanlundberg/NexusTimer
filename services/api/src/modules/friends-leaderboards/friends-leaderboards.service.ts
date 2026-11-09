import {
  type CubeCategory,
  type FriendsLeaderboardQuery,
  type FriendsLeaderboardResponse,
  type FriendsLeaderboardRow,
  getCategoryOrder
} from '@nexustimer/contracts'
import type { SocialService } from '../social/social.service'
import type { UsersService } from '../users/users.service'
import type { BestsCache } from './friends-leaderboards.cache'
import type { FriendsLeaderboardRepository, UserBests } from './friends-leaderboards.repository'

export type FriendsLeaderboardService = {
  get(viewerId: string, query: FriendsLeaderboardQuery): Promise<FriendsLeaderboardResponse>
}

type FriendsLeaderboardDeps = {
  repository: FriendsLeaderboardRepository
  cache: BestsCache
  social: Pick<SocialService, 'friendIds'>
  users: Pick<UsersService, 'publicProfiles' | 'privacyMap'>
}

export function createFriendsLeaderboardService({
  repository,
  cache,
  social,
  users
}: FriendsLeaderboardDeps): FriendsLeaderboardService {
  async function loadBests(ids: string[]): Promise<UserBests[]> {
    const bests = await cache.getMany(ids)
    const missing = ids.filter((id) => !bests.has(id))

    if (missing.length > 0) {
      const stored = new Map((await repository.bests(missing)).map((entry) => [entry.userId, entry.categories]))
      const loaded = missing.map((userId) => ({ userId, categories: stored.get(userId) ?? [] }))
      await cache.setMany(loaded)
      for (const { userId, categories } of loaded) bests.set(userId, categories)
    }

    return ids.map((userId) => ({ userId, categories: bests.get(userId) ?? [] }))
  }

  async function rankedIds(viewerId: string) {
    const friendIds = (await social.friendIds(viewerId)).filter((id) => id !== viewerId)
    const privacy = await users.privacyMap(friendIds)
    const visible = friendIds.filter((id) => privacy.get(id)?.statsVisibility !== 'nobody')
    return { friendCount: friendIds.length, ids: [viewerId, ...visible] }
  }

  return {
    async get(viewerId, { category, metric }) {
      const { friendCount, ids } = await rankedIds(viewerId)
      const bests = await loadBests(ids)

      const categories = new Set<CubeCategory>()
      const entries = bests.flatMap(({ userId, categories: stats }) => {
        for (const entry of stats) if (entry.single || entry.ao5) categories.add(entry.category)
        const stat = stats.find((entry) => entry.category === category)
        const record = stat?.[metric]
        return stat && record ? [{ userId, count: stat.count, ...record }] : []
      })

      entries.sort((a, b) => a.time - b.time || a.endTime - b.endTime)
      const profiles = await users.publicProfiles(entries.map((entry) => entry.userId))

      const rows = entries.flatMap<FriendsLeaderboardRow>(({ userId, time, endTime, count }) => {
        const user = profiles.get(userId)
        if (!user) return []
        return [
          {
            user,
            time,
            count,
            achievedAt: endTime > 0 ? new Date(endTime).toISOString() : null,
            isSelf: userId === viewerId
          }
        ]
      })

      return {
        rows,
        categories: [...categories].sort((a, b) => getCategoryOrder(a) - getCategoryOrder(b)),
        friendCount
      }
    }
  }
}

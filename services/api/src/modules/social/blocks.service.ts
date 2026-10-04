import type { BlocksResponse, FriendEntry } from '@nexustimer/contracts'
import type { RealtimePublisher } from '../../infra/realtime'
import type { UsersService } from '../users/users.service'
import type { BlocksRepository } from './blocks.repository'
import type { FriendsCache } from './friends.cache'
import type { FriendsRepository } from './friends.repository'

const BLOCKS_LIMIT = 500

export type BlocksService = {
  list(userId: string): Promise<BlocksResponse>
  block(userId: string, otherId: string): Promise<'blocked' | 'not-found'>
  unblock(userId: string, otherId: string): Promise<void>
}

type BlocksDeps = {
  repository: Pick<BlocksRepository, 'listBlockedBy' | 'block' | 'unblock'>
  friendships: Pick<FriendsRepository, 'deletePair'>
  friendsCache: Pick<FriendsCache, 'invalidate'>
  users: Pick<UsersService, 'exists' | 'friendUsers'>
  realtime: Pick<RealtimePublisher, 'toUser' | 'toPair'>
}

export function createBlocksService({
  repository,
  friendships,
  friendsCache,
  users,
  realtime
}: BlocksDeps): BlocksService {
  return {
    async list(userId) {
      const docs = await repository.listBlockedBy(userId, BLOCKS_LIMIT)
      const profiles = await users.friendUsers(docs.map((doc) => doc.blockedId))

      const blocked: FriendEntry[] = []
      for (const doc of docs) {
        const user = profiles.get(doc.blockedId)
        if (user) blocked.push({ user, since: doc.createdAt.toISOString() })
      }
      return { blocked }
    },

    async block(userId, otherId) {
      if (!(await users.exists(otherId))) return 'not-found'

      await repository.block(userId, otherId)
      if ((await friendships.deletePair(userId, otherId)) === 'accepted') await friendsCache.invalidate(userId, otherId)
      await realtime.toPair(userId, otherId, 'friend:removed')
      return 'blocked'
    },

    async unblock(userId, otherId) {
      if (await repository.unblock(userId, otherId)) {
        await realtime.toUser(userId, { type: 'friend:removed', userId: otherId })
      }
    }
  }
}

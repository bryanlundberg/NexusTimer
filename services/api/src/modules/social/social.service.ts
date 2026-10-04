import type { BlocksRepository, BlockState } from './blocks.repository'
import type { FriendsCache } from './friends.cache'
import type { FriendsRepository } from './friends.repository'

export type SocialService = {
  blockState(userId: string, otherId: string): Promise<BlockState>
  blockedEitherWay(userId: string): Promise<string[]>
  friendIds(userId: string): Promise<string[]>
  areFriends(userId: string, otherId: string): Promise<boolean>
}

type SocialDeps = { blocks: BlocksRepository; friends: FriendsRepository; friendsCache: FriendsCache }

export function createSocialService({ blocks, friends, friendsCache }: SocialDeps): SocialService {
  async function friendIds(userId: string) {
    const cached = await friendsCache.get(userId)
    if (cached) return cached

    const ids = await friends.acceptedFriendIds(userId)
    await friendsCache.prime(userId, ids)
    return ids
  }

  return {
    blockState: (userId, otherId) => blocks.blockState(userId, otherId),
    blockedEitherWay: (userId) => blocks.blockedEitherWay(userId),
    friendIds,
    async areFriends(userId, otherId) {
      return (await friendIds(userId)).includes(otherId)
    }
  }
}

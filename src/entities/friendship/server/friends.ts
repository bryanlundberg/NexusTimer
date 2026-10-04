import Friendship, { type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import User from '@/entities/user/model/user'
import type { FriendUser } from '@/entities/friendship/model/types'

const FRIEND_USER_PROJECTION = 'name image country wcaId'

async function getFriendIds(userId: string): Promise<string[]> {
  const cached = await friendsCache.get(userId)
  if (cached) return cached

  const docs = await Friendship.find({ users: userId, status: 'accepted' }, { users: 1 }).lean<
    Pick<FriendshipDocument, 'users'>[]
  >()
  const ids = docs.map((doc) => otherUserId(doc, userId))

  await friendsCache.prime(userId, ids)
  return ids
}

export async function areFriends(userId: string, otherId: string): Promise<boolean> {
  return (await getFriendIds(userId)).includes(otherId)
}

function otherUserId(doc: Pick<FriendshipDocument, 'users'>, userId: string): string {
  const other = doc.users.find((id) => id.toString() !== userId)
  return (other ?? doc.users[0]).toString()
}

export async function findFriendUsers(ids: string[]): Promise<Map<string, FriendUser>> {
  if (ids.length === 0) return new Map()
  const users = await User.find({ _id: { $in: ids } })
    .select(FRIEND_USER_PROJECTION)
    .lean<FriendUser[]>()
  return new Map(users.map((user) => [user._id.toString(), { ...user, _id: user._id.toString() }]))
}

import Friendship, { pairKeyOf, type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import User from '@/entities/user/model/user'
import type { FriendUser, RelationshipStatus } from '@/entities/friendship/model/types'

export const FRIEND_USER_PROJECTION = 'name image country wcaId'

export async function getFriendIds(userId: string): Promise<string[]> {
  const cached = await friendsCache.get(userId)
  if (cached) return cached

  const docs = await Friendship.find({ users: userId, status: 'accepted' }, { users: 1 }).lean<
    Pick<FriendshipDocument, 'users'>[]
  >()
  const ids = docs.map((doc) => otherUserId(doc, userId))

  await friendsCache.prime(userId, ids)
  return ids
}

export async function getMutualFriendIds(userId: string, otherId: string): Promise<string[]> {
  const [mine, theirs] = await Promise.all([getFriendIds(userId), getFriendIds(otherId)])
  const theirSet = new Set(theirs)
  return mine.filter((id) => theirSet.has(id))
}

export function relationshipOf(doc: FriendshipDocument | null, userId: string): RelationshipStatus {
  if (!doc) return 'none'
  if (doc.status === 'accepted') return 'friends'
  return doc.requesterId.toString() === userId ? 'pending_out' : 'pending_in'
}

export function findFriendship(userId: string, otherId: string) {
  return Friendship.findOne({ pairKey: pairKeyOf(userId, otherId) }).lean<FriendshipDocument>()
}

export function otherUserId(doc: Pick<FriendshipDocument, 'users'>, userId: string): string {
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

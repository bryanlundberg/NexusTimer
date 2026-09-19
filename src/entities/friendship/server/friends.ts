import Friendship, { type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import User from '@/entities/user/model/user'
import type { FriendUser, RelationshipStatus } from '@/entities/friendship/model/types'
import { pairKeyOf } from '@/shared/lib/pair-key'
import { getPrivacy } from '@/entities/privacy/server/privacy'

export const FRIEND_USER_PROJECTION = 'name image country wcaId'

export const FRIEND_PROFILE_PROJECTION = `${FRIEND_USER_PROJECTION} pronoun method bio`

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

export async function areFriends(userId: string, otherId: string): Promise<boolean> {
  return (await getFriendIds(userId)).includes(otherId)
}

export async function getMutualFriendIds(userId: string, otherId: string): Promise<string[]> {
  const [mine, theirs] = await Promise.all([getFriendIds(userId), getFriendIds(otherId)])
  const theirSet = new Set(theirs)
  return mine.filter((id) => theirSet.has(id))
}

export function relationshipOf(doc: FriendshipDocument | null, userId: string): RelationshipStatus {
  if (!doc) return 'none'
  if (doc.status === 'accepted') return 'friends'
  const isRequester = doc.requesterId.toString() === userId
  if (doc.status === 'declined') return isRequester && !doc.withdrawnAt ? 'pending_out' : 'none'
  return isRequester ? 'pending_out' : 'pending_in'
}

export async function acceptsRequestsFrom(targetId: string, userId: string, mutualCount?: number): Promise<boolean> {
  const { friendRequests } = await getPrivacy(targetId)
  if (friendRequests === 'everyone') return true
  if (friendRequests === 'nobody') return false
  return (mutualCount ?? (await getMutualFriendIds(userId, targetId)).length) > 0
}

export function findFriendship(userId: string, otherId: string) {
  return Friendship.findOne({ pairKey: pairKeyOf(userId, otherId) }).lean<FriendshipDocument>()
}

export function otherUserId(doc: Pick<FriendshipDocument, 'users'>, userId: string): string {
  const other = doc.users.find((id) => id.toString() !== userId)
  return (other ?? doc.users[0]).toString()
}

export async function findFriendUsers(
  ids: string[],
  projection: string = FRIEND_USER_PROJECTION
): Promise<Map<string, FriendUser>> {
  if (ids.length === 0) return new Map()
  const users = await User.find({ _id: { $in: ids } })
    .select(projection)
    .lean<FriendUser[]>()
  return new Map(users.map((user) => [user._id.toString(), { ...user, _id: user._id.toString() }]))
}

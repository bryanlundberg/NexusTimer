import User from '@/entities/user/model/user'
import type { FriendUser } from '@/entities/friendship/model/types'

const FRIEND_USER_PROJECTION = 'name image country wcaId'

export async function findFriendUsers(ids: string[]): Promise<Map<string, FriendUser>> {
  if (ids.length === 0) return new Map()
  const users = await User.find({ _id: { $in: ids } })
    .select(FRIEND_USER_PROJECTION)
    .lean<FriendUser[]>()
  return new Map(users.map((user) => [user._id.toString(), { ...user, _id: user._id.toString() }]))
}

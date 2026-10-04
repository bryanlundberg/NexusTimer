import type { Types } from 'mongoose'
import { FriendshipModel } from './friendship.model'

export type FriendsRepository = {
  acceptedFriendIds(userId: string): Promise<string[]>
}

export const friendsRepository: FriendsRepository = {
  async acceptedFriendIds(userId) {
    const docs = await FriendshipModel.find({ users: userId, status: 'accepted' }, { users: 1 }).lean<
      { users: Types.ObjectId[] }[]
    >()
    return docs.map(({ users }) => (users.find((id) => id.toString() !== userId) ?? users[0])!.toString())
  }
}

import type { Types } from 'mongoose'
import { pairKeyOf } from '../../lib/pair-key'
import { FriendRequestEmailLogModel } from './friend-request-email-log.model'
import { FriendshipModel } from './friendship.model'

export type FriendshipStatus = 'pending' | 'accepted' | 'declined'

export type StoredFriendship = {
  id: string
  users: string[]
  requesterId: string
  status: FriendshipStatus
  createdAt: Date
  acceptedAt?: Date
  withdrawnAt?: Date
}

export type FriendsRepository = {
  acceptedFriendIds(userId: string): Promise<string[]>
  listForUser(userId: string): Promise<StoredFriendship[]>
  findPair(userId: string, otherId: string): Promise<StoredFriendship | null>
  createRequest(requesterId: string, otherId: string): Promise<'created' | 'duplicate'>
  accept(id: string, from: FriendshipStatus): Promise<boolean>
  decline(id: string): Promise<void>
  withdraw(id: string): Promise<void>
  clearWithdrawn(id: string): Promise<void>
  deleteById(id: string, status?: FriendshipStatus): Promise<void>
  deletePair(userId: string, otherId: string): Promise<FriendshipStatus | null>
  claimRequestEmail(senderId: string, recipientId: string): Promise<boolean>
}

type RawFriendship = {
  _id: Types.ObjectId
  users: Types.ObjectId[]
  requesterId: Types.ObjectId
  status: FriendshipStatus
  createdAt: Date
  acceptedAt?: Date | null
  withdrawnAt?: Date | null
}

const isDuplicateKeyError = (error: unknown) => (error as { code?: number } | null)?.code === 11000

function toStored(doc: RawFriendship): StoredFriendship {
  return {
    id: doc._id.toString(),
    users: doc.users.map((id) => id.toString()),
    requesterId: doc.requesterId.toString(),
    status: doc.status,
    createdAt: doc.createdAt,
    ...(doc.acceptedAt ? { acceptedAt: doc.acceptedAt } : {}),
    ...(doc.withdrawnAt ? { withdrawnAt: doc.withdrawnAt } : {})
  }
}

export const friendsRepository: FriendsRepository = {
  async acceptedFriendIds(userId) {
    const docs = await FriendshipModel.find({ users: userId, status: 'accepted' }, { users: 1 }).lean<
      { users: Types.ObjectId[] }[]
    >()
    return docs.map(({ users }) => (users.find((id) => id.toString() !== userId) ?? users[0])!.toString())
  },

  async listForUser(userId) {
    const docs = await FriendshipModel.find({ users: userId }).sort({ createdAt: -1 }).lean<RawFriendship[]>()
    return docs.map(toStored)
  },

  async findPair(userId, otherId) {
    const doc = await FriendshipModel.findOne({ pairKey: pairKeyOf(userId, otherId) }).lean<RawFriendship>()
    return doc ? toStored(doc) : null
  },

  async createRequest(requesterId, otherId) {
    try {
      await FriendshipModel.create({
        pairKey: pairKeyOf(requesterId, otherId),
        users: [requesterId, otherId],
        requesterId,
        status: 'pending'
      })
      return 'created'
    } catch (error) {
      if (isDuplicateKeyError(error)) return 'duplicate'
      throw error
    }
  },

  async accept(id, from) {
    const result = await FriendshipModel.updateOne(
      { _id: id, status: from },
      { $set: { status: 'accepted', acceptedAt: new Date() }, $unset: { declinedAt: 1, withdrawnAt: 1 } }
    )
    return result.modifiedCount > 0
  },

  async decline(id) {
    await FriendshipModel.updateOne(
      { _id: id, status: 'pending' },
      { $set: { status: 'declined', declinedAt: new Date() } }
    )
  },

  async withdraw(id) {
    await FriendshipModel.updateOne({ _id: id, status: 'declined' }, { $set: { withdrawnAt: new Date() } })
  },

  async clearWithdrawn(id) {
    await FriendshipModel.updateOne({ _id: id }, { $unset: { withdrawnAt: 1 } })
  },

  async deleteById(id, status) {
    await FriendshipModel.deleteOne(status ? { _id: id, status } : { _id: id })
  },

  async deletePair(userId, otherId) {
    const removed = await FriendshipModel.findOneAndDelete({ pairKey: pairKeyOf(userId, otherId) }).lean<
      Pick<RawFriendship, 'status'>
    >()
    return removed?.status ?? null
  },

  async claimRequestEmail(senderId, recipientId) {
    try {
      await FriendRequestEmailLogModel.create({ pairKey: pairKeyOf(senderId, recipientId) })
      return true
    } catch (error) {
      if (isDuplicateKeyError(error)) return false
      throw error
    }
  }
}

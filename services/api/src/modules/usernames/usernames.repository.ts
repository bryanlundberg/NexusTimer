import { Types } from 'mongoose'
import { UserModel } from '../users/users.model'

const DUPLICATE_KEY = 11000

export type UsernameChange = 'changed' | 'unchanged' | 'locked' | 'taken' | 'not_found'

export type UsernamesRepository = {
  holder(username: string): Promise<string | null>
  changedAt(userId: string): Promise<number | null | undefined>
  change(userId: string, username: string, now: number): Promise<UsernameChange>
}

type UsernameDoc = { _id: Types.ObjectId; username: string; usernameChangedAt?: number | null }

export const usernamesRepository: UsernamesRepository = {
  async holder(username) {
    const doc = await UserModel.findOne({ username }).select('_id').lean<Pick<UsernameDoc, '_id'>>()
    return doc ? doc._id.toString() : null
  },

  async changedAt(userId) {
    if (!Types.ObjectId.isValid(userId)) return undefined
    const doc = await UserModel.findById(userId).select('usernameChangedAt').lean<UsernameDoc>()
    return doc ? (doc.usernameChangedAt ?? null) : undefined
  },

  async change(userId, username, now) {
    const doc = await UserModel.findById(userId).select('username usernameChangedAt').lean<UsernameDoc>()
    if (!doc) return 'not_found'
    if (doc.username === username) return 'unchanged'
    if (doc.usernameChangedAt) return 'locked'

    try {
      const result = await UserModel.updateOne(
        { _id: doc._id, username: doc.username, usernameChangedAt: { $exists: false } },
        { $set: { username, usernameChangedAt: now } }
      )
      return result.modifiedCount === 1 ? 'changed' : 'locked'
    } catch (error) {
      if ((error as { code?: number } | null)?.code === DUPLICATE_KEY) return 'taken'
      throw error
    }
  }
}

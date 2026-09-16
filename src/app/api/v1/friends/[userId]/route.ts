import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Friendship, { type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import {
  findFriendship,
  findFriendUsers,
  getMutualFriendIds,
  relationshipOf
} from '@/entities/friendship/server/friends'
import type { RelationshipResponse } from '@/entities/friendship/model/types'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { ok, serverError } from '@/shared/api/responses'
import { publishToPair } from '@/shared/lib/realtime/publish'
import { pairKeyOf } from '@/shared/lib/pair-key'

const MUTUAL_SAMPLE_SIZE = 3

export async function GET(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const [friendship, mutualIds] = await Promise.all([
      findFriendship(userId, otherId),
      getMutualFriendIds(userId, otherId)
    ])
    const sample = await findFriendUsers(mutualIds.slice(0, MUTUAL_SAMPLE_SIZE))

    const response: RelationshipResponse = {
      status: relationshipOf(friendship, userId),
      mutual: { count: mutualIds.length, users: [...sample.values()] }
    }
    return ok(response)
  } catch (error) {
    return serverError('friends/[userId]:GET', error)
  }
}

/** Removes a friend, cancels a sent request or declines a received one. */
export async function DELETE(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const removed = await Friendship.findOneAndDelete({
      pairKey: pairKeyOf(userId, otherId)
    }).lean<FriendshipDocument>()
    if (removed) {
      if (removed.status === 'accepted') await friendsCache.invalidate(userId, otherId)
      await publishToPair(userId, otherId, 'friend:removed')
    }

    return ok({ status: 'none' })
  } catch (error) {
    return serverError('friends/[userId]:DELETE', error)
  }
}

import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Friendship from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import {
  acceptsRequestsFrom,
  findFriendship,
  findFriendUsers,
  getMutualFriendIds,
  relationshipOf
} from '@/entities/friendship/server/friends'
import { requestLimits } from '@/entities/friendship/server/request-limits'
import { blockStateOf } from '@/entities/block/server/blocks'
import type { RelationshipResponse } from '@/entities/friendship/model/types'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { ok, serverError } from '@/shared/api/responses'
import { publishToPair, publishToUser } from '@/shared/lib/realtime/publish'

const MUTUAL_SAMPLE_SIZE = 3

export async function GET(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const [friendship, mutualIds, block] = await Promise.all([
      findFriendship(userId, otherId),
      getMutualFriendIds(userId, otherId),
      blockStateOf(userId, otherId)
    ])
    const sample = await findFriendUsers(mutualIds.slice(0, MUTUAL_SAMPLE_SIZE))

    const status = block === 'blocked' ? 'blocked' : relationshipOf(friendship, userId)
    const canRequest =
      status === 'none' && block === 'none' && (await acceptsRequestsFrom(otherId, userId, mutualIds.length))

    const response: RelationshipResponse = {
      status,
      canRequest,
      mutual: { count: mutualIds.length, users: [...sample.values()] }
    }
    return ok(response)
  } catch (error) {
    return serverError('friends/[userId]:GET', error)
  }
}

export async function DELETE(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const existing = await findFriendship(userId, otherId)
    if (!existing) return ok({ status: 'none' })

    const isRequester = existing.requesterId.toString() === userId

    if (existing.status === 'accepted') {
      await Friendship.deleteOne({ _id: existing._id })
      await friendsCache.invalidate(userId, otherId)
      await publishToPair(userId, otherId, 'friend:removed')
    } else if (existing.status === 'pending' && isRequester) {
      await Friendship.deleteOne({ _id: existing._id, status: 'pending' })
      await requestLimits.startCooldown(userId, otherId)
      await publishToPair(userId, otherId, 'friend:removed')
    } else if (existing.status === 'pending') {
      await Friendship.updateOne(
        { _id: existing._id, status: 'pending' },
        { status: 'declined', declinedAt: new Date() }
      )
      await publishToUser(userId, { type: 'friend:removed', userId: otherId })
    } else if (isRequester) {
      await Friendship.updateOne({ _id: existing._id, status: 'declined' }, { withdrawnAt: new Date() })
    }

    return ok({ status: 'none' })
  } catch (error) {
    return serverError('friends/[userId]:DELETE', error)
  }
}

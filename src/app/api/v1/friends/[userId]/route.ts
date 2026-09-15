import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Friendship, { pairKeyOf, type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import {
  findFriendship,
  findFriendUsers,
  getMutualFriendIds,
  relationshipOf
} from '@/entities/friendship/server/friends'
import type { RelationshipResponse } from '@/entities/friendship/model/types'
import { requireUser } from '@/shared/api/require-user'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { badRequest, ok, serverError } from '@/shared/api/responses'
import { publishToPair } from '@/shared/lib/realtime/publish'

const MUTUAL_SAMPLE_SIZE = 3

type Params = { params: Promise<{ userId: string }> }

async function resolveIds({ params }: Params) {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const otherId = (await params).userId
  if (!objectIdSchema.safeParse(otherId).success) return badRequest('Invalid user id')
  if (otherId === userId) return badRequest('Cannot target yourself')

  return { userId, otherId }
}

export async function GET(_request: NextRequest, context: Params) {
  try {
    const ids = await resolveIds(context)
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
export async function DELETE(_request: NextRequest, context: Params) {
  try {
    const ids = await resolveIds(context)
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

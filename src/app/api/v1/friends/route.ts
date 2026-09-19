import { NextRequest, after } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Friendship, { type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import {
  FRIEND_PROFILE_PROJECTION,
  acceptsRequestsFrom,
  findFriendship,
  findFriendUsers,
  otherUserId,
  relationshipOf
} from '@/entities/friendship/server/friends'
import type { FriendEntry, FriendRequestError, FriendsResponse } from '@/entities/friendship/model/types'
import { requestLimits } from '@/entities/friendship/server/request-limits'
import { sendFriendRequestEmail } from '@/features/friends/server/friend-request-email'
import { blockStateOf } from '@/entities/block/server/blocks'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { badRequest, forbidden, notFound, ok, serverError, tooManyRequests } from '@/shared/api/responses'
import { publishToPair } from '@/shared/lib/realtime/publish'
import { pairKeyOf } from '@/shared/lib/pair-key'
import { isDuplicateKeyError } from '@/shared/api/mongo-errors'

const requestSchema = z.object({ userId: objectIdSchema }).strict()

const REQUESTS_CLOSED: FriendRequestError = 'requests-closed'

async function checkNewRequest(userId: string, otherId: string): Promise<Response | null> {
  if (!(await acceptsRequestsFrom(otherId, userId))) return forbidden(REQUESTS_CLOSED)
  if (await requestLimits.onCooldown(userId, otherId))
    return tooManyRequests('request-cooldown' satisfies FriendRequestError)
  if (!(await requestLimits.consumeDaily(userId))) return tooManyRequests('request-limit' satisfies FriendRequestError)
  return null
}

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const docs = await Friendship.find({ users: userId }).sort({ createdAt: -1 }).lean<FriendshipDocument[]>()
    const users = await findFriendUsers(
      docs.map((doc) => otherUserId(doc, userId)),
      FRIEND_PROFILE_PROJECTION
    )

    const response: FriendsResponse = { friends: [], incoming: [], outgoing: [] }

    for (const doc of docs) {
      const user = users.get(otherUserId(doc, userId))
      if (!user) continue

      const status = relationshipOf(doc, userId)
      if (status === 'none') continue
      if (status === 'friends') {
        response.friends.push({ user, since: (doc.acceptedAt ?? doc.createdAt).toISOString() })
      } else {
        const entry: FriendEntry = { user, since: doc.createdAt.toISOString() }
        response[status === 'pending_in' ? 'incoming' : 'outgoing'].push(entry)
      }
    }

    return ok(response)
  } catch (error) {
    return serverError('friends:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, requestSchema)
    if (body instanceof Response) return body

    const otherId = body.userId
    if (otherId === userId) return badRequest('Cannot add yourself')

    await connectDB()

    if (!(await User.exists({ _id: otherId }))) return notFound('User not found')

    const [existing, block] = await Promise.all([findFriendship(userId, otherId), blockStateOf(userId, otherId)])
    if (block === 'blocked') return forbidden('blocked')
    if (block === 'blocked_by') return forbidden(REQUESTS_CLOSED)

    const status = relationshipOf(existing, userId)
    const isRequester = existing?.requesterId.toString() === userId

    if (status === 'pending_in' || (existing?.status === 'declined' && !isRequester && !existing.withdrawnAt)) {
      const accepted = await Friendship.updateOne(
        { _id: existing!._id, status: existing!.status },
        { $set: { status: 'accepted', acceptedAt: new Date() }, $unset: { declinedAt: 1, withdrawnAt: 1 } }
      )
      if (accepted.modifiedCount === 0)
        return ok({ status: relationshipOf(await findFriendship(userId, otherId), userId) })
      await friendsCache.invalidate(userId, otherId)
      await publishToPair(userId, otherId, 'friend:accepted')
      return ok({ status: 'friends' })
    }

    if (existing?.status === 'declined' && isRequester) {
      await Friendship.updateOne({ _id: existing._id }, { $unset: { withdrawnAt: 1 } })
      return ok({ status: 'pending_out' })
    }

    if (status !== 'none') return ok({ status })

    const refusal = await checkNewRequest(userId, otherId)
    if (refusal) return refusal

    if (existing?.status === 'declined') await Friendship.deleteOne({ _id: existing._id, status: 'declined' })

    try {
      await Friendship.create({
        pairKey: pairKeyOf(userId, otherId),
        users: [userId, otherId],
        requesterId: userId,
        status: 'pending'
      })
      await publishToPair(userId, otherId, 'friend:request')
      after(() =>
        sendFriendRequestEmail(userId, otherId).catch((error) => console.error('[friends:POST:email]', error))
      )
      return ok({ status: 'pending_out' })
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
      return ok({ status: relationshipOf(await findFriendship(userId, otherId), userId) })
    }
  } catch (error) {
    return serverError('friends:POST', error)
  }
}

import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Friendship, { pairKeyOf, type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import { findFriendship, findFriendUsers, otherUserId, relationshipOf } from '@/entities/friendship/server/friends'
import type { FriendEntry, FriendsResponse } from '@/entities/friendship/model/types'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { badRequest, notFound, ok, serverError } from '@/shared/api/responses'
import { publishToPair } from '@/shared/lib/realtime/publish'

const DUPLICATE_KEY = 11000

const requestSchema = z.object({ userId: objectIdSchema }).strict()

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const docs = await Friendship.find({ users: userId }).sort({ createdAt: -1 }).lean<FriendshipDocument[]>()
    const users = await findFriendUsers(docs.map((doc) => otherUserId(doc, userId)))

    const response: FriendsResponse = { friends: [], incoming: [], outgoing: [] }

    for (const doc of docs) {
      const user = users.get(otherUserId(doc, userId))
      if (!user) continue // account deleted

      const status = relationshipOf(doc, userId)
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

/** Sends a friend request, or accepts it if the other user already sent one. */
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

    const existing = await findFriendship(userId, otherId)
    const status = relationshipOf(existing, userId)

    if (status === 'pending_in') {
      await Friendship.updateOne(
        { _id: existing!._id, status: 'pending' },
        { status: 'accepted', acceptedAt: new Date() }
      )
      await friendsCache.invalidate(userId, otherId)
      await publishToPair(userId, otherId, 'friend:accepted')
      return ok({ status: 'friends' })
    }

    if (status !== 'none') return ok({ status })

    try {
      await Friendship.create({
        pairKey: pairKeyOf(userId, otherId),
        users: [userId, otherId],
        requesterId: userId,
        status: 'pending'
      })
      await publishToPair(userId, otherId, 'friend:request')
      return ok({ status: 'pending_out' })
    } catch (error) {
      // Both users sent a request at the same moment: report whatever won
      if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error
      return ok({ status: relationshipOf(await findFriendship(userId, otherId), userId) })
    }
  } catch (error) {
    return serverError('friends:POST', error)
  }
}

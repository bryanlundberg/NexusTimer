import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Block, { type BlockDocument } from '@/entities/block/model/block'
import Friendship, { type FriendshipDocument } from '@/entities/friendship/model/friendship'
import { friendsCache } from '@/entities/friendship/model/friends-cache'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import type { FriendEntry } from '@/entities/friendship/model/types'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { badRequest, notFound, ok, serverError } from '@/shared/api/responses'
import { publishToPair } from '@/shared/lib/realtime/publish'
import { pairKeyOf } from '@/shared/lib/pair-key'

const BLOCKS_LIMIT = 500

const blockSchema = z.object({ userId: objectIdSchema }).strict()

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const docs = await Block.find({ blockerId: userId })
      .sort({ createdAt: -1 })
      .limit(BLOCKS_LIMIT)
      .lean<BlockDocument[]>()
    const users = await findFriendUsers(docs.map((doc) => doc.blockedId.toString()))

    const blocked: FriendEntry[] = []
    for (const doc of docs) {
      const user = users.get(doc.blockedId.toString())
      if (user) blocked.push({ user, since: doc.createdAt.toISOString() })
    }

    return ok({ blocked })
  } catch (error) {
    return serverError('blocks:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, blockSchema)
    if (body instanceof Response) return body

    const otherId = body.userId
    if (otherId === userId) return badRequest('Cannot block yourself')

    await connectDB()

    if (!(await User.exists({ _id: otherId }))) return notFound('User not found')

    await Block.updateOne(
      { blockerId: userId, blockedId: otherId },
      { $setOnInsert: { blockerId: userId, blockedId: otherId } },
      { upsert: true }
    )

    const removed = await Friendship.findOneAndDelete({
      pairKey: pairKeyOf(userId, otherId)
    }).lean<FriendshipDocument>()
    if (removed?.status === 'accepted') await friendsCache.invalidate(userId, otherId)
    await publishToPair(userId, otherId, 'friend:removed')

    return ok({ status: 'blocked' })
  } catch (error) {
    return serverError('blocks:POST', error)
  }
}

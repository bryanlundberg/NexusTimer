import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Block from '@/entities/block/model/block'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'

export async function DELETE(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const result = await Block.deleteOne({ blockerId: userId, blockedId: otherId })
    if (result.deletedCount > 0) await publishToUser(userId, { type: 'friend:removed', userId: otherId })

    return ok({ status: 'none' })
  } catch (error) {
    return serverError('blocks/[userId]:DELETE', error)
  }
}

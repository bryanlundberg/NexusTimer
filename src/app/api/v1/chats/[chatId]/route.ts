import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation from '@/entities/chat/model/conversation'
import { otherMemberId, toChatSummary } from '@/entities/chat/server/chat'
import { requireChat, type ChatIdParams } from '@/entities/chat/server/require-chat'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import { noContent, notFound, ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'
import { readReceiptsShared } from '@/entities/privacy/server/privacy'
import { parseJsonBody } from '@/shared/api/parse-json'

const updateSchema = z.object({ muted: z.boolean() }).strict()

export async function GET(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const otherId = otherMemberId(chat, userId)
    const [users, showRead] = await Promise.all([findFriendUsers([otherId]), readReceiptsShared(userId, otherId)])
    const user = users.get(otherId)
    if (!user) return notFound('User not found')

    return ok(toChatSummary(chat, user, userId, showRead))
  } catch (error) {
    return serverError('chats/[chatId]:GET', error)
  }
}

export async function PATCH(request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const body = await parseJsonBody(request, updateSchema)
    if (body instanceof Response) return body

    await Conversation.updateOne(
      { _id: chat._id },
      body.muted ? { $set: { [`muted.${userId}`]: true } } : { $unset: { [`muted.${userId}`]: 1 } }
    )

    await publishToUser(userId, { type: 'chat:muted', chatId: chat._id.toString(), muted: body.muted })
    return ok({ muted: body.muted })
  } catch (error) {
    return serverError('chats/[chatId]:PATCH', error)
  }
}

export async function DELETE(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    await connectDB()

    const now = new Date()
    await Conversation.updateOne(
      { _id: chat._id },
      { $set: { [`clearedAt.${userId}`]: now, [`hiddenAt.${userId}`]: now, [`unread.${userId}`]: 0 } }
    )

    await publishToUser(userId, { type: 'chat:removed', chatId: chat._id.toString() })
    return noContent()
  } catch (error) {
    return serverError('chats/[chatId]:DELETE', error)
  }
}

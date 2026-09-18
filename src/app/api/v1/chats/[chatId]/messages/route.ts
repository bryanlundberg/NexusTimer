import { NextRequest } from 'next/server'
import { z } from 'zod'
import Conversation from '@/entities/chat/model/conversation'
import Message, { type MessageDocument } from '@/entities/chat/model/message'
import { memberIds, otherMemberId, serializeMessage, visibleMessagesFilter } from '@/entities/chat/server/chat'
import { requireChat, type ChatIdParams } from '@/entities/chat/server/require-chat'
import { MAX_MESSAGE_LENGTH, MESSAGES_PAGE_SIZE, type MessagesPage } from '@/entities/chat/model/types'
import { toReceipts } from '@/entities/chat/lib/message-status'
import { areFriends } from '@/entities/friendship/server/friends'
import { parseJsonBody } from '@/shared/api/parse-json'
import { parseSearchParams } from '@/shared/api/parse-query'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { created, forbidden, noContent, ok, serverError } from '@/shared/api/responses'
import { publishToChat, publishToUser } from '@/shared/lib/realtime/publish'

const pageQuerySchema = z.object({ before: objectIdSchema.optional() })

const sendSchema = z.object({ text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH) }).strict()

export async function GET(request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const query = parseSearchParams(request, pageQuerySchema)
    if (query instanceof Response) return query

    const docs = await Message.find({
      ...visibleMessagesFilter(chat._id, userId, chat),
      ...(query.before && { _id: { $lt: query.before } })
    })
      .sort({ _id: -1 })
      .limit(MESSAGES_PAGE_SIZE + 1)
      .lean<MessageDocument[]>()

    return ok<MessagesPage>({
      messages: docs.slice(0, MESSAGES_PAGE_SIZE).reverse().map(serializeMessage),
      hasMore: docs.length > MESSAGES_PAGE_SIZE,
      receipts: toReceipts(chat, otherMemberId(chat, userId))
    })
  } catch (error) {
    return serverError('chats/[chatId]/messages:GET', error)
  }
}

export async function POST(request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const body = await parseJsonBody(request, sendSchema)
    if (body instanceof Response) return body

    if (!(await areFriends(userId, otherMemberId(chat, userId)))) return forbidden('You can only message friends')

    const doc = await Message.create({ conversationId: chat._id, senderId: userId, text: body.text })
    const others = memberIds(chat).filter((memberId) => memberId !== userId)

    await Conversation.updateOne(
      { _id: chat._id },
      {
        $set: {
          lastMessage: { messageId: doc._id, text: doc.text, senderId: doc.senderId, createdAt: doc.createdAt },
          lastMessageAt: doc.createdAt
        },
        $inc: Object.fromEntries(others.map((memberId) => [`unread.${memberId}`, 1]))
      }
    )

    const message = serializeMessage(doc)
    await publishToChat(memberIds(chat), { type: 'message:new', chatId: chat._id.toString(), message })

    return created(message)
  } catch (error) {
    return serverError('chats/[chatId]/messages:POST', error)
  }
}

export async function DELETE(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    await Conversation.updateOne(
      { _id: chat._id },
      { $set: { [`clearedAt.${userId}`]: new Date(), [`unread.${userId}`]: 0 } }
    )

    await publishToUser(userId, { type: 'chat:cleared', chatId: chat._id.toString() })
    return noContent()
  } catch (error) {
    return serverError('chats/[chatId]/messages:DELETE', error)
  }
}

import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation from '@/entities/chat/model/conversation'
import Message, { type MessageDocument } from '@/entities/chat/model/message'
import { ensureConversationId, findConversationReceipts, serializeMessage } from '@/entities/chat/server/chat'
import { MAX_MESSAGE_LENGTH, MESSAGES_PAGE_SIZE, NO_RECEIPTS, type MessagesPage } from '@/entities/chat/model/types'
import { toReceipts } from '@/entities/chat/lib/message-status'
import { areFriends } from '@/entities/friendship/server/friends'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { parseJsonBody } from '@/shared/api/parse-json'
import { parseSearchParams } from '@/shared/api/parse-query'
import { objectIdSchema } from '@/shared/api/zod-helpers'
import { created, forbidden, ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'

const pageQuerySchema = z.object({ before: objectIdSchema.optional() })

const sendSchema = z.object({ text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH) }).strict()

/** Newest page first; pass `before` (a message id) to load older ones. */
export async function GET(request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    const query = parseSearchParams(request, pageQuerySchema)
    if (query instanceof Response) return query

    await connectDB()

    const conversation = await findConversationReceipts(userId, otherId)
    if (!conversation) return ok<MessagesPage>({ messages: [], hasMore: false, receipts: NO_RECEIPTS })

    const docs = await Message.find({
      conversationId: conversation._id,
      ...(query.before && { _id: { $lt: query.before } })
    })
      .sort({ _id: -1 })
      .limit(MESSAGES_PAGE_SIZE + 1)
      .lean<MessageDocument[]>()

    return ok<MessagesPage>({
      messages: docs.slice(0, MESSAGES_PAGE_SIZE).reverse().map(serializeMessage),
      hasMore: docs.length > MESSAGES_PAGE_SIZE,
      receipts: toReceipts(conversation, otherId)
    })
  } catch (error) {
    return serverError('chats/[userId]/messages:GET', error)
  }
}

export async function POST(request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    const body = await parseJsonBody(request, sendSchema)
    if (body instanceof Response) return body

    await connectDB()

    if (!(await areFriends(userId, otherId))) return forbidden('You can only message friends')

    const conversationId = await ensureConversationId(userId, otherId)
    const doc = await Message.create({ conversationId, senderId: userId, text: body.text })

    await Conversation.updateOne(
      { _id: conversationId },
      {
        $set: {
          lastMessage: { text: doc.text, senderId: doc.senderId, createdAt: doc.createdAt },
          lastMessageAt: doc.createdAt
        },
        $inc: { [`unread.${otherId}`]: 1 }
      }
    )

    const message = serializeMessage(doc)
    await Promise.all([
      publishToUser(otherId, { type: 'message:new', userId, message }),
      publishToUser(userId, { type: 'message:new', userId: otherId, message })
    ])

    return created(message)
  } catch (error) {
    return serverError('chats/[userId]/messages:POST', error)
  }
}

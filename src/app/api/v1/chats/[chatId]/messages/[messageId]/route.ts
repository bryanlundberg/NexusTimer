import { NextRequest } from 'next/server'
import { z } from 'zod'
import Message from '@/entities/chat/model/message'
import { memberIds, refreshLastMessage, serializeMessage } from '@/entities/chat/server/chat'
import { requireChatMessage, type MessageIdParams } from '@/entities/chat/server/require-chat-message'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'
import { parseJsonBody } from '@/shared/api/parse-json'
import { parseSearchParams } from '@/shared/api/parse-query'
import { forbidden, noContent, ok, serverError } from '@/shared/api/responses'
import { publishToChat, publishToUser } from '@/shared/lib/realtime/publish'

const editSchema = z.object({ text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH) }).strict()

const deleteQuerySchema = z.object({ scope: z.enum(['me', 'all']).default('me') })

/** Edits one of your own messages. Every member sees the new text and an "edited" mark. */
export async function PATCH(request: NextRequest, context: MessageIdParams) {
  try {
    const target = await requireChatMessage(context)
    if (target instanceof Response) return target
    const { userId, chat, message } = target

    const body = await parseJsonBody(request, editSchema)
    if (body instanceof Response) return body

    if (message.senderId.toString() !== userId) return forbidden('You can only edit your own messages')
    if (message.deletedAt) return forbidden('This message was deleted')
    if (body.text === message.text) return ok(serializeMessage(message))

    const editedAt = new Date()
    await Message.updateOne({ _id: message._id }, { $set: { text: body.text, editedAt } })
    await refreshLastMessage(message.conversationId)

    const updated = serializeMessage({ ...message, text: body.text, editedAt })
    await publishToChat(memberIds(chat), { type: 'message:edited', chatId: chat._id.toString(), message: updated })

    return ok(updated)
  } catch (error) {
    return serverError('chats/[chatId]/messages/[messageId]:PATCH', error)
  }
}

/**
 * `scope=me` hides the message on this side only. `scope=all`, limited to your own
 * messages, clears the text and leaves a tombstone every member sees.
 */
export async function DELETE(request: NextRequest, context: MessageIdParams) {
  try {
    const target = await requireChatMessage(context)
    if (target instanceof Response) return target
    const { userId, chat, message } = target

    const query = parseSearchParams(request, deleteQuerySchema)
    if (query instanceof Response) return query

    const chatId = chat._id.toString()
    const messageId = message._id.toString()

    if (query.scope === 'me') {
      await Message.updateOne({ _id: message._id }, { $addToSet: { deletedFor: userId } })
      // Our own tabs only: everyone else's copy is untouched
      await publishToUser(userId, { type: 'message:deleted', chatId, messageId, scope: 'me' })
      return noContent()
    }

    if (message.senderId.toString() !== userId) return forbidden('You can only delete your own messages for everyone')

    if (!message.deletedAt) {
      await Message.updateOne(
        { _id: message._id },
        { $set: { text: '', deletedAt: new Date() }, $unset: { reactions: 1, editedAt: 1 } }
      )
      await refreshLastMessage(message.conversationId)
    }

    await publishToChat(memberIds(chat), { type: 'message:deleted', chatId, messageId, scope: 'all' })

    return noContent()
  } catch (error) {
    return serverError('chats/[chatId]/messages/[messageId]:DELETE', error)
  }
}

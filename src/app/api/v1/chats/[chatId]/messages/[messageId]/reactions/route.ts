import { NextRequest } from 'next/server'
import { z } from 'zod'
import Message, { type MessageDocument } from '@/entities/chat/model/message'
import { memberIds } from '@/entities/chat/server/chat'
import { requireChatMessage, type MessageIdParams } from '@/entities/chat/server/require-chat-message'
import { isSingleEmoji } from '@/entities/chat/lib/message-content'
import { MAX_REACTION_LENGTH, MAX_REACTIONS_PER_USER } from '@/entities/chat/model/types'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, forbidden, ok, serverError } from '@/shared/api/responses'
import { publishToChat } from '@/shared/lib/realtime/publish'
import type { MessageReaction } from '@/shared/lib/realtime/events'

const reactSchema = z
  .object({ emoji: z.string().max(MAX_REACTION_LENGTH).refine(isSingleEmoji, 'Not a single emoji') })
  .strict()

export async function POST(request: NextRequest, context: MessageIdParams) {
  try {
    const target = await requireChatMessage(context)
    if (target instanceof Response) return target
    const { userId, chat, message } = target

    const body = await parseJsonBody(request, reactSchema)
    if (body instanceof Response) return body

    if (message.deletedAt) return forbidden('This message was deleted')

    const mine = (message.reactions ?? []).filter((reaction) => reaction.userId.toString() === userId)
    const alreadyReacted = mine.some((reaction) => reaction.emoji === body.emoji)

    if (alreadyReacted) {
      await Message.updateOne({ _id: message._id }, { $pull: { reactions: { userId, emoji: body.emoji } } })
    } else {
      if (mine.length >= MAX_REACTIONS_PER_USER) return badRequest('Too many reactions on this message')
      await Message.updateOne(
        { _id: message._id },
        { $push: { reactions: { userId, emoji: body.emoji, createdAt: new Date() } } }
      )
    }

    const fresh = await Message.findOne({ _id: message._id }, { reactions: 1 }).lean<
      Pick<MessageDocument, 'reactions'>
    >()
    const reactions: MessageReaction[] = (fresh?.reactions ?? []).map((reaction) => ({
      userId: reaction.userId.toString(),
      emoji: reaction.emoji
    }))

    await publishToChat(memberIds(chat), {
      type: 'message:reactions',
      chatId: chat._id.toString(),
      messageId: message._id.toString(),
      reactions
    })

    return ok({ reactions })
  } catch (error) {
    return serverError('chats/[chatId]/messages/[messageId]/reactions:POST', error)
  }
}

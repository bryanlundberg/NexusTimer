import {
  type ChatMessagesPage,
  chatMessagesQuerySchema,
  chatMuteSchema,
  type ChatMutedResponse,
  type ChatReadResponse,
  type ChatsDeliveredResponse,
  type ChatSummary,
  deleteMessageQuerySchema,
  type InboxResponse,
  isObjectId,
  messageReactionSchema,
  type MessageReactionsResponse,
  messageTextSchema,
  type RealtimeMessage,
  userTargetSchema
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, created, forbidden, noContent, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson, parseQuery } from '../../http/validation'
import type { StoredConversation, StoredMessage } from './chats.repository'
import type { ChatsService } from './chats.service'

const NOT_FRIENDS = 'You can only message friends'
const MESSAGE_DELETED = 'This message was deleted'

export function chatsRoutes(chats: ChatsService, signedIn: MiddlewareHandler<UserEnv>) {
  async function chatFor(userId: string, chatId: string): Promise<StoredConversation | Response> {
    if (!isObjectId(chatId)) return badRequest('Invalid chat id')
    return (await chats.find(userId, chatId)) ?? notFound('Chat not found')
  }

  async function messageFor(chat: StoredConversation, messageId: string): Promise<StoredMessage | Response> {
    if (!isObjectId(messageId)) return badRequest('Invalid message id')
    return (await chats.findMessage(chat, messageId)) ?? notFound('Message not found')
  }

  return new Hono<AppEnv>()
    .get('/', signedIn, async (c) => {
      try {
        return ok<InboxResponse>(await chats.inbox(c.var.userId))
      } catch (error) {
        return serverError('chats:GET', error)
      }
    })
    .post('/', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, userTargetSchema)
      if (body instanceof Response) return body
      if (body.userId === c.var.userId) return badRequest('Cannot target yourself')

      try {
        const result = await chats.open(c.var.userId, body.userId)
        if ('chat' in result) return ok<ChatSummary>(result.chat)
        return result.error === 'not-friends' ? forbidden(NOT_FRIENDS) : notFound('User not found')
      } catch (error) {
        return serverError('chats:POST', error)
      }
    })
    .post('/delivered', signedIn, async (c) => {
      try {
        return ok<ChatsDeliveredResponse>({ delivered: await chats.markDelivered(c.var.userId) })
      } catch (error) {
        return serverError('chats/delivered:POST', error)
      }
    })
    .get('/:chatId', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        const summary = await chats.summary(chat, c.var.userId)
        return summary ? ok<ChatSummary>(summary) : notFound('User not found')
      } catch (error) {
        return serverError('chats/[chatId]:GET', error)
      }
    })
    .patch('/:chatId', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        const body = await parseJson(c.req.raw, chatMuteSchema)
        if (body instanceof Response) return body

        await chats.setMuted(chat, c.var.userId, body.muted)
        return ok<ChatMutedResponse>({ muted: body.muted })
      } catch (error) {
        return serverError('chats/[chatId]:PATCH', error)
      }
    })
    .delete('/:chatId', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        await chats.hide(chat, c.var.userId)
        return noContent()
      } catch (error) {
        return serverError('chats/[chatId]:DELETE', error)
      }
    })
    .post('/:chatId/read', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        await chats.markRead(chat, c.var.userId)
        return ok<ChatReadResponse>({ unread: 0 })
      } catch (error) {
        return serverError('chats/[chatId]/read:POST', error)
      }
    })
    .get('/:chatId/messages', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        const query = parseQuery(c.req.url, chatMessagesQuerySchema)
        if (query instanceof Response) return query

        return ok<ChatMessagesPage>(await chats.messages(chat, c.var.userId, query.before))
      } catch (error) {
        return serverError('chats/[chatId]/messages:GET', error)
      }
    })
    .post('/:chatId/messages', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        const body = await parseJson(c.req.raw, messageTextSchema)
        if (body instanceof Response) return body

        const result = await chats.send(chat, c.var.userId, body.text)
        return 'message' in result ? created<RealtimeMessage>(result.message) : forbidden(NOT_FRIENDS)
      } catch (error) {
        return serverError('chats/[chatId]/messages:POST', error)
      }
    })
    .delete('/:chatId/messages', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat

        await chats.clear(chat, c.var.userId)
        return noContent()
      } catch (error) {
        return serverError('chats/[chatId]/messages:DELETE', error)
      }
    })
    .patch('/:chatId/messages/:messageId', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat
        const message = await messageFor(chat, c.req.param('messageId'))
        if (message instanceof Response) return message

        const body = await parseJson(c.req.raw, messageTextSchema)
        if (body instanceof Response) return body

        const result = await chats.edit(chat, c.var.userId, message, body.text)
        if ('message' in result) return ok<RealtimeMessage>(result.message)
        return forbidden(result.error === 'not-sender' ? 'You can only edit your own messages' : MESSAGE_DELETED)
      } catch (error) {
        return serverError('chats/[chatId]/messages/[messageId]:PATCH', error)
      }
    })
    .delete('/:chatId/messages/:messageId', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat
        const message = await messageFor(chat, c.req.param('messageId'))
        if (message instanceof Response) return message

        const query = parseQuery(c.req.url, deleteMessageQuerySchema)
        if (query instanceof Response) return query

        const result = await chats.deleteMessage(chat, c.var.userId, message, query.scope)
        return result === 'deleted' ? noContent() : forbidden('You can only delete your own messages for everyone')
      } catch (error) {
        return serverError('chats/[chatId]/messages/[messageId]:DELETE', error)
      }
    })
    .post('/:chatId/messages/:messageId/reactions', signedIn, async (c) => {
      try {
        const chat = await chatFor(c.var.userId, c.req.param('chatId'))
        if (chat instanceof Response) return chat
        const message = await messageFor(chat, c.req.param('messageId'))
        if (message instanceof Response) return message

        const body = await parseJson(c.req.raw, messageReactionSchema)
        if (body instanceof Response) return body

        const result = await chats.react(chat, c.var.userId, message, body.emoji)
        if ('reactions' in result) return ok<MessageReactionsResponse>(result)
        return result.error === 'deleted'
          ? forbidden(MESSAGE_DELETED)
          : badRequest('Too many reactions on this message')
      } catch (error) {
        return serverError('chats/[chatId]/messages/[messageId]/reactions:POST', error)
      }
    })
}

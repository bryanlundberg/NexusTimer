import type { ChatMessagesPage, FriendUser, RealtimeMessage } from '@nexustimer/contracts'

export {
  type ChatSummary,
  type ChatThread,
  type DeleteScope,
  type InboxResponse,
  INBOX_LIMIT,
  MAX_MESSAGE_LENGTH,
  MAX_REACTION_LENGTH,
  MAX_REACTIONS_PER_USER,
  type MessageReaction,
  MESSAGES_PAGE_SIZE,
  NO_RECEIPTS,
  type Receipts
} from '@nexustimer/contracts'

export interface ChatMessage extends RealtimeMessage {
  pending?: boolean
  failed?: boolean
  clientKey?: string
}

export type ChatPeer = Pick<FriendUser, '_id' | 'name' | 'image'>

export interface MessagesPage extends Omit<ChatMessagesPage, 'messages'> {
  messages: ChatMessage[]
}

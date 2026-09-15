'use client'

import { useTranslations } from 'next-intl'
import type { ChatPeer } from '@/entities/chat/model/types'
import { useRelationship } from '@/entities/friendship/model/useFriends'
import { useConversation } from '@/features/chat/model/useConversation'
import { MessageComposer } from '@/features/chat/ui/MessageComposer'
import { MessageList } from '@/widgets/chat/ui/MessageList'

interface Props {
  userId: string
  peer?: ChatPeer
  compact?: boolean
  focusRequested?: boolean
  onFocused?: () => void
}

export function ConversationBody({ userId, peer, compact = false, focusRequested, onFocused }: Props) {
  const t = useTranslations('Index.ChatPage')
  const { data: relationship } = useRelationship(userId)
  const conversation = useConversation(userId)

  const canMessage = relationship?.status === 'friends'

  return (
    <>
      <MessageList
        messages={conversation.messages}
        myId={conversation.myId}
        peer={peer}
        hasMore={conversation.hasMore}
        isLoading={conversation.isLoading}
        isLoadingOlder={conversation.isLoadingOlder}
        receipts={conversation.receipts}
        isOtherTyping={conversation.isOtherTyping}
        compact={compact}
        onLoadOlder={conversation.loadOlder}
        onRetry={conversation.retry}
      />

      {relationship && !canMessage ? (
        <p className="border-t border-border/60 px-4 py-3 text-center text-sm text-muted-foreground">
          {t('only-friends')}
        </p>
      ) : (
        <MessageComposer
          onSend={conversation.send}
          onTyping={conversation.notifyTyping}
          disabled={!canMessage}
          compact={compact}
          focusRequested={focusRequested}
          onFocused={onFocused}
        />
      )}
    </>
  )
}

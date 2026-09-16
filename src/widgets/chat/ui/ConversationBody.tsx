'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ChatPeer, DeleteScope } from '@/entities/chat/model/types'
import { useRelationship } from '@/entities/friendship/model/useFriends'
import { useConversation } from '@/features/chat/model/useConversation'
import { MessageComposer, type ComposerEdit } from '@/features/chat/ui/MessageComposer'
import { MessageList } from '@/widgets/chat/ui/MessageList'

interface Props {
  chatId: string
  peer?: ChatPeer
  compact?: boolean
  focusRequested?: boolean
  onFocused?: () => void
}

export function ConversationBody({ chatId, peer, compact = false, focusRequested, onFocused }: Props) {
  const t = useTranslations('Index.ChatPage')
  const { data: relationship } = useRelationship(peer?._id ?? '')
  const conversation = useConversation(chatId, peer?._id)
  const [editing, setEditing] = useState<ComposerEdit | null>(null)

  const canMessage = relationship?.status === 'friends'
  const { messages } = conversation

  // The other member may delete the very message being edited, here or from another tab
  useEffect(() => {
    if (editing && !messages.some((message) => message._id === editing.id && !message.deletedAt)) setEditing(null)
  }, [messages, editing])

  const handleDelete = (messageId: string, scope: DeleteScope) => {
    if (editing?.id === messageId) setEditing(null)
    void conversation.deleteMessage(messageId, scope)
  }

  return (
    <>
      <MessageList
        messages={messages}
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
        onReact={(messageId, emoji) => void conversation.toggleReaction(messageId, emoji)}
        onEdit={(message) => setEditing({ id: message._id, text: message.text })}
        onDelete={handleDelete}
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
          editing={editing}
          onSaveEdit={(messageId, text) => void conversation.editMessage(messageId, text)}
          onCancelEdit={() => setEditing(null)}
        />
      )}
    </>
  )
}

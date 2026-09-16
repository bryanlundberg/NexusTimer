'use client'

import { useTranslations } from 'next-intl'
import { MessagesSquare } from 'lucide-react'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { ChatEmptyState } from '@/widgets/chat/ui/ChatEmptyState'
import { ConversationView } from '@/widgets/chat/ui/ConversationView'

export default function MessagesPage() {
  const t = useTranslations('Index.ChatPage')
  const activeUserId = useActiveChatStore((state) => state.activeUserId)

  if (!activeUserId) {
    return <ChatEmptyState icon={MessagesSquare} title={t('select')} description={t('select-hint')} />
  }

  return <ConversationView key={activeUserId} userId={activeUserId} />
}

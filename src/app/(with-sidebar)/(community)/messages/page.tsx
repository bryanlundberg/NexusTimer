'use client'

import { useTranslations } from 'next-intl'
import { MessagesSquare } from 'lucide-react'
import { ChatEmptyState } from '@/widgets/chat/ui/ChatEmptyState'

export default function MessagesPage() {
  const t = useTranslations('Index.ChatPage')

  return <ChatEmptyState icon={MessagesSquare} title={t('select')} description={t('select-hint')} />
}

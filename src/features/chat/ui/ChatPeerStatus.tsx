'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { type PresenceState } from '@/features/presence/model/usePresence'
import { usePresenceLabel } from '@/features/presence/model/usePresenceLabel'
import { useTypingChats } from '@/features/chat/model/typing-store'

interface Props {
  chatId: string
  presence: PresenceState
  className?: string
}

export function ChatPeerStatus({ chatId, presence, className }: Props) {
  const tChat = useTranslations('Index.ChatPage')
  const isTyping = useTypingChats().has(chatId)
  const presenceLabel = usePresenceLabel(presence)

  const label = isTyping ? tChat('typing') : presenceLabel
  if (!label) return null

  return (
    <span className={cn('truncate text-xs', isTyping ? 'text-primary' : 'text-muted-foreground', className)}>
      {label}
    </span>
  )
}

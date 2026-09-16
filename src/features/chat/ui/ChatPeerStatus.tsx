'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'
import { useTypingChats } from '@/features/chat/model/typing-store'

interface Props {
  chatId: string
  presence: PresenceState
  className?: string
}

export function ChatPeerStatus({ chatId, presence, className }: Props) {
  const tChat = useTranslations('Index.ChatPage')
  const tPresence = useTranslations('Index.Presence')
  const locale = useLocale()
  const isTyping = useTypingChats().has(chatId)
  const display = resolvePresenceDisplay(presence)

  let label: string | null
  if (isTyping) label = tChat('typing')
  else if (display !== 'offline') label = tPresence(display)
  else if (presence.lastSeen)
    label = tPresence('last-seen', { time: dayjs(presence.lastSeen).locale(locale).fromNow() })
  else label = null

  if (!label) return null

  return (
    <span className={cn('truncate text-xs', isTyping ? 'text-primary' : 'text-muted-foreground', className)}>
      {label}
    </span>
  )
}

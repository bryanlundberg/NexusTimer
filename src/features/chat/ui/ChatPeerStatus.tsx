'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'
import { useTypingUsers } from '@/features/chat/model/typing-store'

interface Props {
  userId: string
  presence: PresenceState
  className?: string
}

export function ChatPeerStatus({ userId, presence, className }: Props) {
  const tChat = useTranslations('Index.ChatPage')
  const tPresence = useTranslations('Index.Presence')
  const locale = useLocale()
  const isTyping = useTypingUsers().has(userId)
  const display = resolvePresenceDisplay(presence)

  let label: string | null
  if (isTyping) label = tChat('typing')
  else if (display !== 'offline') label = tPresence(display)
  else if (presence.lastOnline && presence.status !== 'invisible')
    label = tPresence('last-seen', { time: dayjs(presence.lastOnline).locale(locale).fromNow() })
  else label = null

  if (!label) return null

  return (
    <span className={cn('truncate text-xs', isTyping ? 'text-primary' : 'text-muted-foreground', className)}>
      {label}
    </span>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MessageStatus } from '@/entities/chat/lib/message-status'

const ICONS = {
  sending: Clock,
  failed: AlertCircle,
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck
} as const

const COLORS: Record<MessageStatus, string> = {
  sending: 'text-muted-foreground',
  failed: 'text-destructive',
  sent: 'text-muted-foreground',
  delivered: 'text-muted-foreground',
  read: 'text-sky-500 dark:text-sky-400'
}

export function MessageStatusIcon({ status, className }: { status: MessageStatus; className?: string }) {
  const t = useTranslations('Index.ChatPage')
  const Icon = ICONS[status]

  return (
    <Icon
      role="img"
      aria-label={t(`status-${status}`)}
      className={cn('size-3.5 shrink-0', COLORS[status], className)}
      strokeWidth={2.5}
    />
  )
}

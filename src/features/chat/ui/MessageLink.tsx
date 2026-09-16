'use client'

import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useOpenChat } from '@/features/chat/model/useOpenChat'

interface Props {
  userId: string
  variant?: 'outline' | 'ghost'
  showLabel?: boolean
  className?: string
}

export function MessageLink({ userId, variant = 'outline', showLabel = false, className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const openChat = useOpenChat()

  return (
    <button
      type="button"
      onClick={() => openChat(userId)}
      aria-label={t('message')}
      className={cn(buttonVariants({ variant, size: 'sm' }), 'btn-notch btn-notch-border gap-1.5', className)}
    >
      <MessageCircle className="size-4" />
      <span className={cn(!showLabel && 'hidden sm:inline')}>{t('message')}</span>
    </button>
  )
}

'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useOpenChat } from '@/features/chat/model/useOpenChat'

interface Props {
  userId: string
  variant?: 'outline' | 'ghost'
  className?: string
}

export function MessageLink({ userId, variant = 'outline', className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const openChat = useOpenChat()

  return (
    <Link
      href={`/messages/${userId}`}
      onClick={(event) => {
        // Keep new-tab and middle clicks as regular links
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        openChat(userId)
      }}
      aria-label={t('message')}
      className={cn(buttonVariants({ variant, size: 'sm' }), 'btn-notch btn-notch-border gap-1.5', className)}
    >
      <MessageCircle className="size-4" />
      <span className="hidden sm:inline">{t('message')}</span>
    </Link>
  )
}

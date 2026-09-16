'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
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
  const { openChatWith } = useOpenChat()
  const [busy, setBusy] = useState(false)

  // Resolving the conversation is a round trip, so the button waits for it
  const open = async () => {
    if (busy) return
    setBusy(true)
    try {
      await openChatWith(userId)
    } catch {
      toast.error(t('action-failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void open()}
      disabled={busy}
      aria-label={t('message')}
      className={cn(buttonVariants({ variant, size: 'sm' }), 'btn-notch btn-notch-border gap-1.5', className)}
    >
      <MessageCircle className="size-4" />
      <span className={cn(!showLabel && 'hidden sm:inline')}>{t('message')}</span>
    </button>
  )
}

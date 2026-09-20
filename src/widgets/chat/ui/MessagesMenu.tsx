'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBadgeCount } from '@/shared/lib/badge-count'
import { CountBadge } from '@/shared/ui/count-badge/CountBadge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InboxListSkeleton } from '@/shared/ui/skeletons/chat-skeleton'
import { useInbox } from '@/entities/chat/model/useInbox'
import { useOpenChat } from '@/features/chat/model/useOpenChat'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'
import { useTypingChats } from '@/features/chat/model/typing-store'
import { ThreadPreview } from '@/widgets/chat/ui/ThreadPreview'

export function MessagesMenu() {
  const t = useTranslations('Index.ChatPage')
  const { data: session } = useSession()
  const { data: inbox, isLoading } = useInbox()
  const router = useRouter()
  const { openChat } = useOpenChat()
  const [open, setOpen] = useState(false)

  const threads = inbox?.threads ?? []
  const unread = inbox?.totalUnread ?? 0

  const typingChats = useTypingChats()

  const handleOpenChange = (next: boolean) => {
    if (next && getDockCapacity() === 0) {
      router.push('/messages')
      return
    }
    setOpen(next)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <span className="relative inline-flex shrink-0">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="btn-notch btn-notch-alt btn-notch-border size-9 [&_svg]:size-5"
            aria-label={unread > 0 ? `${t('title')} (${formatBadgeCount(unread)})` : t('title')}
          >
            <MessageCircle />
          </Button>
        </DropdownMenuTrigger>
        <CountBadge count={unread} aria-hidden className="pointer-events-none absolute -top-1.5 -right-1.5 z-10" />
      </span>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-80"
        innerClassName="p-0"
        // Returning focus to the trigger would let the timer's space bar reopen the menu
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5">
          <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t('title')}
          </span>
          <Link
            href="/messages"
            onClick={() => setOpen(false)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('expand')}
          </Link>
        </div>

        <div className="max-h-[26rem] overflow-y-auto">
          {isLoading && <InboxListSkeleton rows={4} compact />}

          {!isLoading && threads.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">{t('empty')}</p>
              <Link
                href="/friends"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                {t('go-to-friends')}
              </Link>
            </div>
          )}

          {threads.map((thread) => (
            <DropdownMenuItem
              key={thread._id}
              onSelect={() => openChat(thread._id)}
              className="gap-3 border-b border-border/40 px-3 py-2.5 last:border-b-0"
            >
              <ThreadPreview thread={thread} myId={session?.user?.id} isTyping={typingChats.has(thread._id)} />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBadgeCount } from '@/shared/lib/badge-count'
import { CountBadge } from '@/shared/ui/count-badge/CountBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useInbox } from '@/entities/chat/model/useInbox'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { canUseDock } from '@/features/chat/model/useOpenChat'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'
import { useTypingUsers } from '@/features/chat/model/typing-store'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { ThreadPreview } from '@/widgets/chat/ui/ThreadPreview'

/** On desktop it opens conversations as floating windows; on mobile it goes to /messages. */
export function MessagesMenu() {
  const t = useTranslations('Index.ChatPage')
  const { data: session } = useSession()
  const { data: inbox, isLoading } = useInbox()
  const pathname = usePathname()
  const router = useRouter()
  const openWindow = useChatDockStore((state) => state.openWindow)
  const [open, setOpen] = useState(false)

  const threads = inbox?.threads ?? []
  const unread = inbox?.totalUnread ?? 0

  // Presence listeners only while the menu is open
  const userIds = useMemo(() => (open ? threads.map((thread) => thread.user._id) : []), [open, threads])
  const presence = usePresenceList(userIds)
  const typingUsers = useTypingUsers()

  const handleOpenChange = (next: boolean) => {
    if (next && getDockCapacity() === 0) {
      router.push('/messages')
      return
    }
    setOpen(next)
  }

  // The dock is hidden on the messages page, so there the conversation opens in the page itself
  const openThread = (userId: string) => {
    if (canUseDock(pathname)) openWindow(userId)
    else router.push(`/messages/${userId}`)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      {/* The notched button clips its content, so the badge sits beside it in the wrapper */}
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
          {isLoading && (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

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
              key={thread.user._id}
              onSelect={() => openThread(thread.user._id)}
              className="gap-3 border-b border-border/40 px-3 py-2.5 last:border-b-0"
            >
              <ThreadPreview
                thread={thread}
                myId={session?.user?.id}
                presence={presence[thread.user._id]}
                isTyping={typingUsers.has(thread.user._id)}
              />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

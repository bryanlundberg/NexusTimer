'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MessagesSquare, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { useInbox } from '@/entities/chat/model/useInbox'
import { useTypingUsers } from '@/features/chat/model/typing-store'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { ChatEmptyState } from '@/widgets/chat/ui/ChatEmptyState'
import { ThreadPreview } from '@/widgets/chat/ui/ThreadPreview'

export function InboxList({ activeUserId }: { activeUserId?: string }) {
  const t = useTranslations('Index.ChatPage')
  const { data: session } = useSession()
  const { data, isLoading } = useInbox()

  const userIds = useMemo(() => (data?.threads ?? []).map((thread) => thread.user._id), [data?.threads])
  const presence = usePresenceList(userIds)
  const typingUsers = useTypingUsers()

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (data.threads.length === 0) {
    return (
      <ChatEmptyState
        icon={MessagesSquare}
        title={t('empty')}
        description={t('empty-hint')}
        action={
          <Link
            href="/friends"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'btn-notch btn-notch-border gap-1.5')}
          >
            <Users className="size-4" />
            {t('go-to-friends')}
          </Link>
        }
      />
    )
  }

  return (
    <nav aria-label={t('title')} className="min-h-0 flex-1 overflow-y-auto">
      {data.threads.map((thread) => {
        const isActive = thread.user._id === activeUserId

        return (
          <Link
            key={thread.user._id}
            href={`/messages/${thread.user._id}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex w-full items-center gap-3 border-b border-l-2 border-b-border/40 border-l-transparent px-3 py-3 transition-colors duration-150 hover:bg-muted/20',
              isActive && 'border-l-primary bg-muted/30'
            )}
          >
            <ThreadPreview
              thread={thread}
              myId={session?.user?.id}
              presence={presence[thread.user._id]}
              isTyping={typingUsers.has(thread.user._id)}
            />
          </Link>
        )
      })}
    </nav>
  )
}

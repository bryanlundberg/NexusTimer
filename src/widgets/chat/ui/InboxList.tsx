'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MessagesSquare, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { InboxListSkeleton } from '@/shared/ui/skeletons/chat-skeleton'
import { useInbox } from '@/entities/chat/model/useInbox'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { useTypingChats } from '@/features/chat/model/typing-store'
import { ChatEmptyState } from '@/widgets/chat/ui/ChatEmptyState'
import { ThreadPreview } from '@/widgets/chat/ui/ThreadPreview'

export function InboxList({ activeChatId }: { activeChatId: string | null }) {
  const t = useTranslations('Index.ChatPage')
  const { data: session } = useSession()
  const { data, isLoading } = useInbox()
  const setActiveChat = useActiveChatStore((state) => state.setActiveChat)

  const typingChats = useTypingChats()

  if (isLoading || !data) return <InboxListSkeleton />

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
    <div aria-label={t('title')} className="min-h-0 flex-1 overflow-y-auto">
      {data.threads.map((thread) => {
        const isActive = thread._id === activeChatId

        return (
          <button
            key={thread._id}
            type="button"
            onClick={() => setActiveChat(thread._id)}
            aria-current={isActive || undefined}
            className={cn(
              'flex w-full items-center gap-3 border-b border-l-2 border-b-border/40 border-l-transparent px-3 py-3 text-left transition-colors duration-150 hover:bg-muted/20',
              isActive && 'border-l-primary bg-muted/30'
            )}
          >
            <ThreadPreview thread={thread} myId={session?.user?.id} isTyping={typingChats.has(thread._id)} />
          </button>
        )
      })}
    </div>
  )
}

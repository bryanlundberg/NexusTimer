'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/entities/user/model/useUser'
import { ChatAvatar } from '@/entities/chat/ui/ChatAvatar'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { ChatMenu } from '@/features/chat/ui/ChatMenu'
import { ChatPeerStatus } from '@/features/chat/ui/ChatPeerStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, usePresence } from '@/features/presence/model/usePresence'
import { ConversationBody } from '@/widgets/chat/ui/ConversationBody'

export function ConversationView({ userId }: { userId: string }) {
  const t = useTranslations('Index.ChatPage')
  const clearActiveChat = useActiveChatStore((state) => state.clearActiveChat)
  const { data: user } = useUser(userId)
  const presence = usePresence(userId)
  const peer = user?.name ? { _id: userId, name: user.name as string, image: user.image as string } : undefined

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border/60 px-3 py-2.5">
        <button
          type="button"
          onClick={clearActiveChat}
          aria-label={t('back')}
          className="-ml-1 flex size-8 items-center justify-center text-muted-foreground hover:text-foreground md:hidden"
        >
          <ArrowLeft className="size-4" />
        </button>

        {peer ? (
          <Link href={`/people/${userId}`} className="flex min-w-0 items-center gap-2.5 hover:opacity-80">
            <div className="relative shrink-0">
              <ChatAvatar peer={peer} className="size-9" />
              <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-background p-px">
                <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2.5" />
              </span>
            </div>
            <span className="flex min-w-0 flex-col leading-tight">
              <span title={peer.name} className="truncate text-sm font-bold">
                {peer.name}
              </span>
              <ChatPeerStatus userId={userId} presence={presence} />
            </span>
          </Link>
        ) : (
          <Skeleton className="h-9 w-44" />
        )}

        <ChatMenu userId={userId} onDeleted={clearActiveChat} className="ml-auto" />
      </header>

      <ConversationBody userId={userId} peer={peer} />
    </>
  )
}

'use client'

import { Link } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { ConversationPeerSkeleton } from '@/shared/ui/skeletons/chat-skeleton'
import { useChat } from '@/entities/chat/model/useChat'
import { ChatAvatar } from '@/entities/chat/ui/ChatAvatar'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { ChatMenu } from '@/features/chat/ui/ChatMenu'
import { ChatPeerStatus } from '@/features/chat/ui/ChatPeerStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, usePresence } from '@/features/presence/model/usePresence'
import { ConversationBody } from '@/widgets/chat/ui/ConversationBody'

export function ConversationView({ chatId }: { chatId: string }) {
  const t = useTranslations('Index.ChatPage')
  const clearActiveChat = useActiveChatStore((state) => state.clearActiveChat)
  const { peer } = useChat(chatId)
  const presence = usePresence(peer?._id)

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
          <Link href={`/people/${peer._id}`} className="flex min-w-0 items-center gap-2.5 hover:opacity-80">
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
              <ChatPeerStatus chatId={chatId} presence={presence} />
            </span>
          </Link>
        ) : (
          <ConversationPeerSkeleton />
        )}

        <ChatMenu chatId={chatId} onDeleted={clearActiveChat} className="ml-auto" />
      </header>

      <ConversationBody chatId={chatId} peer={peer} />
    </>
  )
}

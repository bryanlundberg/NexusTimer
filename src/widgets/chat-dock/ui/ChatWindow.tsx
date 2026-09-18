'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronUp, Maximize2, Minus, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { CountBadge } from '@/shared/ui/count-badge/CountBadge'
import { useChat } from '@/entities/chat/model/useChat'
import { useInbox } from '@/entities/chat/model/useInbox'
import { ChatAvatar } from '@/entities/chat/ui/ChatAvatar'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { useChatDockStore, type DockWindow } from '@/features/chat/model/chat-dock-store'
import { ChatMenu } from '@/features/chat/ui/ChatMenu'
import { ChatPeerStatus } from '@/features/chat/ui/ChatPeerStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, usePresence } from '@/features/presence/model/usePresence'
import { ConversationBody } from '@/widgets/chat/ui/ConversationBody'
import { DockIconButton, dockIconButtonClass, keepFocusOnMouseDown } from '@/widgets/chat-dock/ui/DockIconButton'

export function ChatWindow({ chatId, minimized }: DockWindow) {
  const t = useTranslations('Index.ChatPage')
  const { peer } = useChat(chatId)
  const presence = usePresence(peer?._id)
  const { data: inbox } = useInbox()
  const closeWindow = useChatDockStore((state) => state.closeWindow)
  const toggleMinimized = useChatDockStore((state) => state.toggleMinimized)
  const isFocusRequested = useChatDockStore((state) => state.focusedChatId === chatId)
  const clearFocus = useChatDockStore((state) => state.clearFocus)
  const setActiveChat = useActiveChatStore((state) => state.setActiveChat)

  const unread = inbox?.threads.find((thread) => thread._id === chatId)?.unread ?? 0

  return (
    <section
      aria-label={peer?.name}
      className={cn(
        'notch-bl-tr pointer-events-auto flex w-80 flex-col overflow-hidden border border-b-0 border-border bg-background shadow-2xl transition-[height] duration-200 [--nblt:14px]',
        minimized ? 'h-14' : 'h-[30rem]'
      )}
    >
      <header className="flex h-14 shrink-0 items-center gap-0.5 border-b border-border/60 pr-1 pl-2.5">
        <button
          type="button"
          onClick={() => toggleMinimized(chatId)}
          onMouseDown={keepFocusOnMouseDown}
          aria-expanded={!minimized}
          title={peer?.name}
          className="flex h-full min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          {peer ? (
            <>
              <span className="relative shrink-0">
                <ChatAvatar peer={peer} className="size-9" />
                <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-background p-px">
                  <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2.5" />
                </span>
                {minimized && <CountBadge count={unread} className="absolute -top-1.5 -right-2" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm leading-tight font-bold">{peer.name}</span>
                <ChatPeerStatus chatId={chatId} presence={presence} className="leading-tight" />
              </span>
            </>
          ) : (
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <Skeleton className="size-9 shrink-0" />
              <Skeleton className="h-3.5 w-full max-w-32" />
            </span>
          )}
        </button>

        <ChatMenu chatId={chatId} onDeleted={() => closeWindow(chatId)} className={dockIconButtonClass} />
        <Link
          href="/messages"
          onClick={() => {
            setActiveChat(chatId)
            closeWindow(chatId)
          }}
          aria-label={t('expand')}
          title={t('expand')}
          className={dockIconButtonClass}
        >
          <Maximize2 className="size-3.5" />
        </Link>
        <DockIconButton
          onClick={() => toggleMinimized(chatId)}
          aria-label={minimized ? t('restore') : t('minimize')}
          title={minimized ? t('restore') : t('minimize')}
        >
          {minimized ? <ChevronUp className="size-4" /> : <Minus className="size-4" />}
        </DockIconButton>
        <DockIconButton onClick={() => closeWindow(chatId)} aria-label={t('close')} title={t('close')}>
          <X className="size-4" />
        </DockIconButton>
      </header>

      {!minimized && (
        <ConversationBody
          chatId={chatId}
          peer={peer}
          compact
          focusRequested={isFocusRequested}
          onFocused={clearFocus}
        />
      )}
    </section>
  )
}

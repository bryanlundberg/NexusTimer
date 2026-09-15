'use client'

import { Fragment, useLayoutEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import type { ChatMessage, ChatPeer, Receipts } from '@/entities/chat/model/types'
import { messageStatus } from '@/entities/chat/lib/message-status'
import { ChatAvatar } from '@/entities/chat/ui/ChatAvatar'
import { MessageBubble } from '@/entities/chat/ui/MessageBubble'
import { TypingIndicator } from '@/entities/chat/ui/TypingIndicator'

const GROUP_GAP_MINUTES = 5
const NEAR_BOTTOM_PX = 80

interface Props {
  messages: ChatMessage[]
  myId?: string
  peer?: ChatPeer
  hasMore: boolean
  isLoading: boolean
  isLoadingOlder: boolean
  receipts: Receipts
  isOtherTyping: boolean
  compact?: boolean
  onLoadOlder: () => void
  onRetry: (message: ChatMessage) => void
}

export function MessageList({
  messages,
  myId,
  peer,
  hasMore,
  isLoading,
  isLoadingOlder,
  receipts,
  isOtherTyping,
  compact = false,
  onLoadOlder,
  onRetry
}: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()

  const scrollRef = useRef<HTMLDivElement>(null)
  const nearBottom = useRef(true)
  const previousFirstId = useRef<string | undefined>(undefined)
  const previousHeight = useRef(0)

  const firstId = messages[0]?._id
  const last = messages.at(-1)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const prependedOlder = previousFirstId.current !== undefined && firstId !== previousFirstId.current
    if (prependedOlder) {
      // Keep the same message under the viewport after older ones load above it
      el.scrollTop += el.scrollHeight - previousHeight.current
    } else if (nearBottom.current || last?.senderId === myId) {
      el.scrollTop = el.scrollHeight
    }

    previousFirstId.current = firstId
    previousHeight.current = el.scrollHeight
  }, [firstId, last?._id, last?.senderId, myId, isOtherTyping])

  const handleScroll = () => {
    const el = scrollRef.current
    if (el) nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
  }

  if (isLoading) {
    return (
      <div className={cn('flex flex-1 flex-col gap-3', compact ? 'p-3' : 'p-4')}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className={i % 2 ? 'h-9 w-2/5 self-end' : 'h-9 w-1/2'} />
        ))}
      </div>
    )
  }

  const avatarSlot = (visible: boolean) =>
    peer && (visible ? <ChatAvatar peer={peer} className="size-6 shrink-0" /> : <span className="w-6 shrink-0" />)

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', compact ? 'p-3' : 'p-4')}
    >
      {/* Pushes a short conversation to the bottom, next to the composer */}
      {messages.length > 0 && <div aria-hidden className="grow" />}

      {hasMore && (
        <Button variant="ghost" size="sm" className="mb-3 self-center" disabled={isLoadingOlder} onClick={onLoadOlder}>
          {isLoadingOlder && <Loader2 className="size-3.5 animate-spin" />}
          {t('load-older')}
        </Button>
      )}

      {messages.length === 0 && (
        <div className="m-auto flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          {peer && <ChatAvatar peer={peer} className="size-12" />}
          <p>{t('no-messages')}</p>
        </div>
      )}

      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const next = messages[index + 1]
        const time = dayjs(message.createdAt)
        const isOwn = message.senderId === myId

        const newDay = !previous || !time.isSame(previous.createdAt, 'day')
        const groupedWithPrevious =
          !newDay &&
          previous.senderId === message.senderId &&
          time.diff(previous.createdAt, 'minute') < GROUP_GAP_MINUTES
        const endsGroup =
          !next ||
          next.senderId !== message.senderId ||
          dayjs(next.createdAt).diff(time, 'minute') >= GROUP_GAP_MINUTES ||
          !dayjs(next.createdAt).isSame(time, 'day')

        return (
          <Fragment key={message._id}>
            {newDay && (
              <div className="my-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span className="h-px flex-1 bg-border/60" />
                {time.locale(locale).format('LL')}
                <span className="h-px flex-1 bg-border/60" />
              </div>
            )}
            <div
              className={cn(
                'flex items-end gap-2',
                groupedWithPrevious ? 'mt-1' : 'mt-3',
                isOwn ? 'justify-end' : 'justify-start'
              )}
            >
              {!isOwn && avatarSlot(endsGroup)}
              <MessageBubble
                message={message}
                isOwn={isOwn}
                status={isOwn ? messageStatus(message, receipts) : undefined}
                onRetry={() => onRetry(message)}
              />
            </div>
          </Fragment>
        )
      })}

      {isOtherTyping && (
        <div className="mt-3 flex items-end gap-2">
          {avatarSlot(true)}
          <TypingIndicator />
        </div>
      )}
    </div>
  )
}

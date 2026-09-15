'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import type { ChatMessage } from '@/entities/chat/model/types'
import type { MessageStatus } from '@/entities/chat/lib/message-status'
import { isBigEmoji, splitLinks } from '@/entities/chat/lib/message-content'
import { MessageStatusIcon } from '@/entities/chat/ui/MessageStatusIcon'

interface Props {
  message: ChatMessage
  isOwn: boolean
  status?: MessageStatus
  onRetry?: () => void
}

export function MessageBubble({ message, isOwn, status, onRetry }: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()
  const bigEmoji = isBigEmoji(message.text)

  const meta = (
    <span className="inline-flex items-center gap-1 text-[10px] leading-none tabular-nums text-muted-foreground">
      <time dateTime={message.createdAt}>{dayjs(message.createdAt).locale(locale).format('LT')}</time>
      {isOwn && status && <MessageStatusIcon status={status} />}
    </span>
  )

  return (
    <div className={cn('flex max-w-[min(80%,40rem)] flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>
      {bigEmoji ? (
        <>
          <span className={cn('text-4xl leading-tight', message.pending && 'opacity-60')}>{message.text}</span>
          {meta}
        </>
      ) : (
        <div
          className={cn(
            'flow-root border px-2.5 pt-1.5 pb-1 text-sm wrap-break-word transition-opacity',
            isOwn
              ? 'border-[color-mix(in_oklab,var(--primary)_35%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_14%,var(--background))]'
              : 'border-border/60 bg-muted/50',
            message.failed && 'border-destructive',
            message.pending && 'opacity-80'
          )}
        >
          <span className="whitespace-pre-wrap">
            {splitLinks(message.text).map((part, index) =>
              part.type === 'link' ? (
                <a
                  key={index}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow ugc"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  {part.value}
                </a>
              ) : (
                part.value
              )
            )}
          </span>
          {/* Floats into the last line when there is room, like messaging apps */}
          <span className="relative top-1 float-right ml-3 pt-1">{meta}</span>
        </div>
      )}

      {message.failed && (
        <button type="button" onClick={onRetry} className="text-[11px] text-destructive hover:underline">
          {t('failed')}
        </button>
      )}
    </div>
  )
}

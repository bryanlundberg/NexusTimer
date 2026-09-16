'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Ban } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import type { ChatMessage, DeleteScope } from '@/entities/chat/model/types'
import type { MessageStatus } from '@/entities/chat/lib/message-status'
import { isBigEmoji, splitLinks } from '@/entities/chat/lib/message-content'
import { MessageStatusIcon } from '@/entities/chat/ui/MessageStatusIcon'
import { MessageReactions } from '@/entities/chat/ui/MessageReactions'
import { MessageActions } from '@/features/chat/ui/MessageActions'

interface Props {
  message: ChatMessage
  isOwn: boolean
  myId?: string
  status?: MessageStatus
  onRetry?: () => void
  onReact: (emoji: string) => void
  onEdit: () => void
  onDelete: (scope: DeleteScope) => void
}

export function MessageBubble({ message, isOwn, myId, status, onRetry, onReact, onEdit, onDelete }: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()
  const isDeleted = !!message.deletedAt
  const bigEmoji = !isDeleted && isBigEmoji(message.text)
  // A message still on its way has no server id to act on
  const isSettled = !message.pending && !message.failed

  const surface = isOwn
    ? 'border-[color-mix(in_oklab,var(--primary)_35%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_14%,var(--background))]'
    : 'border-border/60 bg-muted/50'

  const meta = (
    <span className="inline-flex items-center gap-1 text-[10px] leading-none tabular-nums text-muted-foreground">
      {message.editedAt && !isDeleted && <span className="not-tabular-nums italic">{t('edited')}</span>}
      <time dateTime={message.createdAt}>{dayjs(message.createdAt).locale(locale).format('LT')}</time>
      {isOwn && status && <MessageStatusIcon status={status} />}
    </span>
  )

  const body = bigEmoji ? (
    <>
      <span className={cn('text-4xl leading-tight', message.pending && 'opacity-60')}>{message.text}</span>
      {/* There is no bubble behind the emoji, so the meta gets its own instead of floating */}
      <span className={cn('inline-flex border px-2 py-1 transition-opacity', surface, message.pending && 'opacity-80')}>
        {meta}
      </span>
    </>
  ) : (
    <div
      className={cn(
        'flow-root max-w-full border px-2.5 pt-1.5 pb-1 text-sm wrap-anywhere transition-opacity',
        surface,
        message.failed && 'border-destructive',
        message.pending && 'opacity-80',
        isDeleted && 'border-dashed bg-transparent'
      )}
    >
      {isDeleted ? (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground italic">
          <Ban className="size-3.5 shrink-0" />
          {t('deleted-message')}
        </span>
      ) : (
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
      )}
      {/* Floats into the last line when there is room, like messaging apps */}
      <span className="relative top-1 float-right ml-3 pt-1">{meta}</span>
    </div>
  )

  return (
    <div
      className={cn(
        'group/message flex min-w-0 max-w-[min(80%,40rem)] flex-col gap-1',
        isOwn ? 'items-end' : 'items-start'
      )}
    >
      <div className={cn('flex min-w-0 items-center gap-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
        <div className={cn('flex min-w-0 flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>{body}</div>

        {isSettled && (
          // Hover is the desktop affordance; on touch there is none, so they stay visible
          <div className="shrink-0 opacity-0 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100">
            <MessageActions
              isOwn={isOwn}
              canEdit={isOwn && !isDeleted}
              canReact={!isDeleted}
              canDeleteForEveryone={isOwn && !isDeleted}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>

      {!isDeleted && <MessageReactions reactions={message.reactions} myId={myId} isOwn={isOwn} onToggle={onReact} />}

      {message.failed && (
        <button type="button" onClick={onRetry} className="text-[11px] text-destructive hover:underline">
          {t('failed')}
        </button>
      )}
    </div>
  )
}

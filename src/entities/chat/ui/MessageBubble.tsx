'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Ban } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { useLongPress } from '@/shared/model/useLongPress'
import type { ChatMessage, DeleteScope } from '@/entities/chat/model/types'
import type { MessageStatus } from '@/entities/chat/lib/message-status'
import { isBigEmoji, parseMessage, type MessageNode } from '@/entities/chat/lib/message-content'
import { MessageStatusIcon } from '@/entities/chat/ui/MessageStatusIcon'
import { MessageReactions } from '@/entities/chat/ui/MessageReactions'
import { SolveCard } from '@/entities/chat/ui/SolveCard'
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
  const nodes = isDeleted || bigEmoji ? [] : parseMessage(message.text)
  const hasCard = nodes.some((node) => node.type === 'solve')
  const soloCard = nodes.length === 1 && nodes[0].type === 'solve' ? nodes[0].data : null
  const isSettled = !message.pending && !message.failed
  const [revealed, setRevealed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { handlers: pressHandlers } = useLongPress({ onLongPress: () => isSettled && setRevealed(true) })

  useEffect(() => {
    if (!revealed) return
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setRevealed(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [revealed])

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
      <span className={cn('inline-flex border px-2 py-1 transition-opacity', surface, message.pending && 'opacity-80')}>
        {meta}
      </span>
    </>
  ) : (
    <div
      className={cn(
        'flow-root max-w-full border px-2.5 pt-1.5 pb-1 text-sm wrap-anywhere transition-opacity',
        hasCard && 'w-full',
        soloCard && 'p-0',
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
      ) : soloCard ? (
        <SolveCard data={soloCard} className="my-0 border-0 bg-transparent" />
      ) : (
        <span className="whitespace-pre-wrap">
          <MessageText nodes={nodes} />
        </span>
      )}
      {soloCard ? (
        <span className="-mt-1 flex justify-end px-2.5 pb-1.5">{meta}</span>
      ) : (
        <span className="relative top-1 float-right ml-3 pt-1">{meta}</span>
      )}
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={cn(
        'group/message flex min-w-0 max-w-[min(80%,40rem)] flex-col gap-1',
        hasCard && 'w-full max-w-[min(100%,20rem)]',
        isOwn ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn('flex min-w-0 items-center gap-1', isOwn ? 'flex-row-reverse' : 'flex-row', hasCard && 'w-full')}
      >
        <div
          {...pressHandlers}
          onContextMenu={(event) => {
            if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === 'touch') {
              event.preventDefault()
            }
          }}
          className={cn(
            'flex min-w-0 flex-col gap-0.5 pointer-coarse:select-none pointer-coarse:[-webkit-touch-callout:none]',
            isOwn ? 'items-end' : 'items-start',
            hasCard && 'flex-1'
          )}
        >
          {body}
        </div>

        <div
          inert={!isSettled}
          className={cn(
            'shrink-0 opacity-0 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100',
            revealed ? 'opacity-100' : 'pointer-coarse:invisible',
            !isSettled && 'invisible'
          )}
        >
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

function MessageText({ nodes }: { nodes: MessageNode[] }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return node.value
      case 'link':
        return (
          <a
            key={index}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="underline underline-offset-2 hover:opacity-80"
          >
            {node.value}
          </a>
        )
      case 'solve':
        return <SolveCard key={index} data={node.data} />
      case 'code':
        return (
          <code key={index} className="rounded-sm bg-foreground/10 px-1 font-mono text-[0.9em]">
            {node.value}
          </code>
        )
      case 'bold':
        return (
          <strong key={index} className="font-bold">
            <MessageText nodes={node.children} />
          </strong>
        )
      case 'italic':
        return (
          <em key={index}>
            <MessageText nodes={node.children} />
          </em>
        )
      case 'strike':
        return (
          <s key={index}>
            <MessageText nodes={node.children} />
          </s>
        )
    }
  })
}

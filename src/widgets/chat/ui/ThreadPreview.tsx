'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { CountBadge } from '@/shared/ui/count-badge/CountBadge'
import type { ChatThread } from '@/entities/chat/model/types'
import { ChatAvatar } from '@/entities/chat/ui/ChatAvatar'
import { MessageStatusIcon } from '@/entities/chat/ui/MessageStatusIcon'
import { messageStatus } from '@/entities/chat/lib/message-status'
import { parseMessage, toPlainText } from '@/entities/chat/lib/message-content'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'

interface Props {
  thread: ChatThread
  myId?: string
  presence?: PresenceState
  isTyping: boolean
}

export function ThreadPreview({ thread: { user, lastMessage, unread, receipts }, myId, presence, isTyping }: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()
  const isMine = lastMessage?.senderId === myId
  const isDeleted = !!lastMessage && lastMessage.text === ''

  return (
    <>
      <div className="relative shrink-0">
        <ChatAvatar peer={user} className="size-10" />
        <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-background p-px">
          <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2" />
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span title={user.name} className={cn('truncate text-sm', unread > 0 ? 'font-extrabold' : 'font-bold')}>
            {user.name}
          </span>
          {lastMessage && (
            <time dateTime={lastMessage.createdAt} className="shrink-0 text-[10px] text-muted-foreground">
              {dayjs(lastMessage.createdAt).locale(locale).fromNow(true)}
            </time>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          {isTyping ? (
            <span className="truncate text-xs text-primary">{t('typing')}</span>
          ) : (
            <span className="flex min-w-0 items-center gap-1">
              {isMine && lastMessage && <MessageStatusIcon status={messageStatus(lastMessage, receipts)} />}
              <span
                className={cn(
                  'truncate text-xs',
                  isDeleted && 'italic',
                  unread > 0 && !isDeleted ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}
              >
                {isDeleted ? t('deleted-message') : lastMessage && toPlainText(parseMessage(lastMessage.text))}
              </span>
            </span>
          )}
          <CountBadge count={unread} className="ring-0" />
        </div>
      </div>
    </>
  )
}

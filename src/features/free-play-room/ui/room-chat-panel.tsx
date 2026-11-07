'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MessageSquare, SendHorizontal } from 'lucide-react'
import { ROOM_CHAT_MAX_LENGTH } from '@nexustimer/contracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { parseMessage } from '@/entities/chat/lib/message-content'
import { MessageText } from '@/entities/chat/ui/MessageText'
import { sendRoomChat } from '@/features/free-play-room/model/room-actions'
import { useRoomChatMessages } from '@/features/free-play-room/model/useRoomChatMessages'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'

const GROUP_WINDOW_MS = 2 * 60_000
const STICK_TO_BOTTOM_PX = 48

interface RoomChatPanelProps {
  selfId: string
  className?: string
}

export default function RoomChatPanel({ selfId, className }: RoomChatPanelProps) {
  const t = useTranslations('Multiplayer.chat')
  const locale = useLocale()
  const { messages } = useRoomChatMessages(selfId)
  const markChatRead = useRoomStore((state) => state.markChatRead)
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const stuckToBottom = useRef(true)
  const lastId = messages.at(-1)?.id ?? 0

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible && lastId) markChatRead(lastId)
  }, [visible, lastId, markChatRead])

  useEffect(() => {
    const list = listRef.current
    if (list && stuckToBottom.current) list.scrollTop = list.scrollHeight
  }, [lastId, visible])

  const canSend = text.trim().length > 0

  const submit = () => {
    if (!canSend) return
    if (sendRoomChat(text)) {
      setText('')
      stuckToBottom.current = true
    }
  }

  return (
    <div data-no-timer-touch className={cn('flex min-h-0 flex-col', className)}>
      <div className="flex items-center gap-1.5 px-1 pb-1 border-b border-border">
        <MessageSquare className="size-3 text-muted-foreground" />
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t('title')}
        </span>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label={t('title')}
        onScroll={(event) => {
          const list = event.currentTarget
          stuckToBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < STICK_TO_BOTTOM_PX
        }}
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto py-2"
      >
        {messages.length === 0 ? (
          <p className="m-auto px-2 text-center text-xs text-muted-foreground">{t('empty')}</p>
        ) : (
          messages.map((message, index) => {
            const previous = messages[index - 1]
            const grouped = previous?.userId === message.userId && message.sentAt - previous.sentAt < GROUP_WINDOW_MS
            const isOwn = message.userId === selfId
            return (
              <div key={message.id} className={cn('min-w-0 px-1 text-sm', !grouped && index > 0 && 'mt-2')}>
                {!grouped && (
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn('truncate text-xs font-semibold', isOwn && 'text-primary')}>
                      {message.name}
                    </span>
                    <time
                      dateTime={new Date(message.sentAt).toISOString()}
                      className="shrink-0 text-[10px] tabular-nums text-muted-foreground"
                    >
                      {dayjs(message.sentAt).locale(locale).format('LT')}
                    </time>
                  </div>
                )}
                <p className="wrap-anywhere">
                  <MessageText nodes={parseMessage(message.text)} />
                </p>
              </div>
            )
          })
        )}
      </div>

      <form
        className="flex items-center gap-1.5 border-t border-border pt-2"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={ROOM_CHAT_MAX_LENGTH}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          className="h-9 min-w-0 text-sm"
        />
        <Button type="submit" size="icon" disabled={!canSend} aria-label={t('send')} className="size-9 shrink-0">
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  )
}

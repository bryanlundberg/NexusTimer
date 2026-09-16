'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'
import { cn } from '@/shared/lib/utils'

interface Props {
  onSend: (text: string) => void
  onTyping?: () => void
  disabled?: boolean
  compact?: boolean
  focusRequested?: boolean
  onFocused?: () => void
}

export function MessageComposer({ onSend, onTyping, disabled, compact = false, focusRequested, onFocused }: Props) {
  const t = useTranslations('Index.ChatPage')
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!focusRequested || disabled) return
    inputRef.current?.focus()
    onFocused?.()
  }, [focusRequested, disabled, onFocused])
  const canSend = !disabled && text.trim().length > 0

  const submit = () => {
    if (!canSend) return
    onSend(text)
    setText('')
  }

  return (
    <form
      className={cn('flex items-end gap-2 border-t border-border/60', compact ? 'p-2' : 'p-3')}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <Textarea
        ref={inputRef}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          if (event.target.value.trim()) onTyping?.()
        }}
        onKeyDown={(event) => {
          // Enter sends, Shift+Enter adds a line; ignore Enter while an IME is composing
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            submit()
          }
        }}
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder={t('placeholder')}
        aria-label={t('placeholder')}
        disabled={disabled}
        className={cn('min-h-10 overflow-y-auto', compact ? 'max-h-28' : 'max-h-40')}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        aria-label={t('send')}
        className={cn('btn-notch btn-notch-alt shrink-0', compact && 'size-9')}
      >
        <SendHorizontal className="size-4" />
      </Button>
    </form>
  )
}

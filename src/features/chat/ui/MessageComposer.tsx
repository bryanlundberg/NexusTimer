'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Pencil, SendHorizontal, Smile, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EmojiPicker } from '@/shared/ui/emoji-picker/EmojiPicker'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'
import { cn } from '@/shared/lib/utils'

export interface ComposerEdit {
  id: string
  text: string
}

interface Props {
  onSend: (text: string) => void
  onTyping?: () => void
  disabled?: boolean
  compact?: boolean
  focusRequested?: boolean
  onFocused?: () => void
  editing?: ComposerEdit | null
  onSaveEdit?: (messageId: string, text: string) => void
  onCancelEdit?: () => void
  draft?: string
  onDraftApplied?: () => void
}

export function MessageComposer({
  onSend,
  onTyping,
  disabled,
  compact = false,
  focusRequested,
  onFocused,
  editing,
  onSaveEdit,
  onCancelEdit,
  draft,
  onDraftApplied
}: Props) {
  const t = useTranslations('Index.ChatPage')
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const caret = useRef(0)

  useEffect(() => {
    if (!focusRequested || disabled) return
    inputRef.current?.focus()
    onFocused?.()
  }, [focusRequested, disabled, onFocused])

  const editingId = editing?.id
  useEffect(() => {
    if (!editingId) return
    setText(editing.text)
    caret.current = editing.text.length
    inputRef.current?.focus()
  }, [editingId])

  useEffect(() => {
    if (!draft || editing) return
    setText(draft)
    caret.current = draft.length
    inputRef.current?.focus()
    onDraftApplied?.()
  }, [draft, editing, onDraftApplied])

  const canSend = !disabled && text.trim().length > 0

  const reset = () => {
    setText('')
    caret.current = 0
  }

  const cancelEdit = () => {
    reset()
    onCancelEdit?.()
  }

  const submit = () => {
    if (!canSend) return
    if (editing) {
      onSaveEdit?.(editing.id, text)
      cancelEdit()
      return
    }
    onSend(text)
    reset()
  }

  const insertEmoji = (emoji: string) => {
    setText((current) => {
      const at = Math.min(caret.current, current.length)
      caret.current = at + emoji.length
      return current.slice(0, at) + emoji + current.slice(at)
    })
  }

  const rememberCaret = () => {
    caret.current = inputRef.current?.selectionStart ?? text.length
  }

  return (
    <form
      className={cn('flex flex-col border-t border-border/60', compact ? 'p-2' : 'p-3')}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      {editing && (
        <div className="mb-2 flex items-center gap-2 border-l-2 border-[color-mix(in_oklab,var(--primary)_55%,var(--border))] bg-muted/40 px-2 py-1.5">
          <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {t('editing')}
            </span>
            <span className="truncate text-xs text-muted-foreground">{editing.text}</span>
          </span>
          <button
            type="button"
            onClick={cancelEdit}
            aria-label={t('cancel')}
            className="ml-auto flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={t('emoji')}
              className={cn('btn-notch shrink-0 text-muted-foreground', compact && 'size-9')}
            >
              <Smile className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-72" innerClassName="p-0">
            <EmojiPicker onSelect={insertEmoji} />
          </DropdownMenuContent>
        </DropdownMenu>

        <Textarea
          ref={inputRef}
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            rememberCaret()
            if (!editing && event.target.value.trim()) onTyping?.()
          }}
          onSelect={rememberCaret}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              submit()
            } else if (event.key === 'Escape' && editing) {
              event.preventDefault()
              cancelEdit()
            }
          }}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          disabled={disabled}
          className={cn('min-h-10 min-w-0 overflow-y-auto wrap-anywhere', compact ? 'max-h-28' : 'max-h-40')}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label={t(editing ? 'save' : 'send')}
          className={cn('btn-notch btn-notch-alt shrink-0', compact && 'size-9')}
        >
          {editing ? <Check className="size-4" /> : <SendHorizontal className="size-4" />}
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { groupReactions } from '@/entities/chat/lib/reactions'
import type { MessageReaction } from '@/entities/chat/model/types'

interface Props {
  reactions: MessageReaction[] | undefined
  myId?: string
  isOwn: boolean
  onToggle: (emoji: string) => void
}

export function MessageReactions({ reactions, myId, isOwn, onToggle }: Props) {
  const t = useTranslations('Index.ChatPage')
  const groups = groupReactions(reactions, myId)
  if (groups.length === 0) return null

  return (
    <div className={cn('-mt-1 flex flex-wrap gap-1', isOwn ? 'justify-end' : 'justify-start')}>
      {groups.map(({ emoji, count, mine }) => (
        <button
          key={emoji}
          type="button"
          aria-pressed={mine}
          aria-label={t(mine ? 'reaction-remove' : 'reaction-add', { emoji })}
          onClick={() => onToggle(emoji)}
          className={cn(
            'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-sm leading-none transition-colors',
            mine
              ? 'border-[color-mix(in_oklab,var(--primary)_45%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_18%,var(--background))]'
              : 'border-border/60 bg-muted/50 hover:bg-muted'
          )}
        >
          <span>{emoji}</span>
          {count > 1 && <span className="text-[11px] tabular-nums text-muted-foreground">{count}</span>}
        </button>
      ))}
    </div>
  )
}

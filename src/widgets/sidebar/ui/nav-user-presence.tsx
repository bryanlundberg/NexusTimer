'use client'

import { useTranslations } from 'next-intl'

import { usePresenceStatus } from '@/features/presence/model/usePresenceStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import type { PresenceDisplay, PresenceStatus } from '@/features/presence/model/usePresence'
import { cn } from '@/shared/lib/utils'

const PRESENCE_OPTIONS: { value: PresenceStatus; display: PresenceDisplay }[] = [
  { value: 'online', display: 'online' },
  { value: 'away', display: 'away' },
  { value: 'busy', display: 'busy' },
  { value: 'invisible', display: 'offline' }
]

export function NavUserPresence() {
  const t = useTranslations('Index.Presence')
  const { status, setStatus } = usePresenceStatus()

  return (
    <div className="flex items-center justify-between gap-2 border-y border-border px-3 py-2">
      <span className="truncate font-display text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {t(status)}
      </span>
      <div className="flex shrink-0 gap-1">
        {PRESENCE_OPTIONS.map(({ value, display }) => (
          <button
            key={value}
            type="button"
            title={t(value)}
            aria-label={t(value)}
            aria-pressed={status === value}
            onClick={() => setStatus(value)}
            className={cn(
              'flex size-7 cursor-pointer items-center justify-center transition-colors pointer-coarse:size-10',
              status === value ? 'bg-foreground/10' : 'hover:bg-accent'
            )}
          >
            <PresenceDot state={display} className="size-3" />
          </button>
        ))}
      </div>
    </div>
  )
}

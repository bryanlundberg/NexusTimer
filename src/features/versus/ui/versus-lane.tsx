'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Pencil } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { LaneStatus, VersusPlayer } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'
import { useVersusLane } from '@/features/versus/model/useVersusLane'

const SURFACE_BY_STATUS: Record<LaneStatus, string> = {
  [LaneStatus.IDLE]: 'bg-background',
  [LaneStatus.HOLDING]: 'bg-cube-red/15',
  [LaneStatus.READY]: 'bg-cube-green/20',
  [LaneStatus.RUNNING]: 'bg-background',
  [LaneStatus.DONE]: 'bg-muted/40'
}

export default function VersusLane({
  player,
  rotated,
  className
}: {
  player: VersusPlayer
  rotated: boolean
  className?: string
}) {
  const t = useTranslations('VersusPage')
  const scramble = useVersusStore((state) => state.scramble)
  const setPlayerName = useVersusStore((state) => state.setPlayerName)
  const { displayTime, handlers } = useVersusLane(player)
  const [isEditingName, setIsEditingName] = useState(false)

  const displayName = player.name || t('player', { number: player.id + 1 })
  const isIdle = player.status === LaneStatus.IDLE
  const isDone = player.status === LaneStatus.DONE

  return (
    <div
      data-testid={`versus-lane-${player.id}`}
      className={cn(
        'relative flex min-h-0 flex-col overflow-hidden transition-colors duration-150',
        SURFACE_BY_STATUS[player.status],
        rotated && 'rotate-180',
        className
      )}
      style={{ '--lane': player.color } as React.CSSProperties}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: 'var(--lane)' }} />

      <div className="flex shrink-0 items-center gap-1.5 px-3 pt-2">
        {isEditingName ? (
          <input
            autoFocus
            value={player.name}
            maxLength={16}
            placeholder={displayName}
            onChange={(event) => setPlayerName(player.id, event.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(event) => event.key === 'Enter' && setIsEditingName(false)}
            className="w-32 border-b bg-transparent text-sm font-semibold outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            className="group flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
          >
            <span style={{ color: 'var(--lane)' }}>{displayName}</span>
            <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-50" />
          </button>
        )}
        {player.history.length > 0 && (
          <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
            {player.history.map((time) => formatTime(time)).join(' · ')}
          </span>
        )}
      </div>

      {isIdle && (
        <div className="max-h-[45%] shrink-0 overflow-y-auto overscroll-contain px-3 pt-1.5">
          <p className="text-center font-mono text-sm font-medium leading-snug text-foreground/80 sm:text-base">
            {scramble}
          </p>
        </div>
      )}

      <button
        type="button"
        data-testid={`versus-lane-trigger-${player.id}`}
        disabled={isDone}
        {...handlers}
        className={cn(
          'flex min-h-0 grow select-none flex-col items-center justify-center gap-2 px-3 pb-3 touch-none',
          !isDone && 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'font-mono text-4xl font-bold tabular-nums leading-none sm:text-5xl',
            isDone && 'text-[color:var(--lane)]'
          )}
        >
          {formatTime(displayTime)}
        </span>

        {isIdle && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">{t('hold-to-start')}</span>
        )}
        {player.status === LaneStatus.READY && (
          <span className="text-[10px] uppercase tracking-wide text-cube-green">{t('release-to-go')}</span>
        )}
      </button>
    </div>
  )
}

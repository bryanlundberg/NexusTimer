'use client'

import { useState, type PointerEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import type { BarSegment } from '@/features/solve-replay/lib/replayTimeline'

interface ReplayProgressBarProps {
  index: number
  total: number
  segments: readonly BarSegment[]
  onSeek: (index: number) => void
  describe: (index: number) => string
}

export default function ReplayProgressBar({ index, total, segments, onSeek, describe }: ReplayProgressBarProps) {
  const t = useTranslations('Index.ReplayPlayer')
  const [hover, setHover] = useState<number | null>(null)
  const pct = total > 0 ? (index / total) * 100 : 0
  const hoverPct = hover !== null && total > 0 ? (hover / total) * 100 : null

  const track = (event: PointerEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    setHover(Math.round(ratio * total))
  }

  return (
    <div className="group relative h-5 w-full">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden bg-muted transition-[height] duration-[var(--dur-fast)] group-hover:h-2 group-focus-within:ring-2 group-focus-within:ring-ring">
        {segments.length > 0 ? (
          <>
            {segments.map(({ key, left, width, colorClass }) => (
              <div
                key={key}
                className={cn('absolute inset-y-0', colorClass)}
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            ))}
            <div className="absolute inset-y-0 right-0 bg-background/70" style={{ width: `${100 - pct}%` }} />
          </>
        ) : (
          <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${pct}%` }} />
        )}
        {hoverPct !== null && (
          <div className="absolute inset-y-0 w-px bg-foreground/50" style={{ left: `${hoverPct}%` }} />
        )}
      </div>

      <div
        className="pointer-events-none absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 bg-foreground shadow-sm transition-transform duration-[var(--dur-fast)] group-hover:scale-y-110"
        style={{ left: `${pct}%` }}
      />

      {hoverPct !== null && (
        <div
          className="pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap border bg-popover px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-popover-foreground shadow-md"
          style={{ left: `clamp(2.5rem, ${hoverPct}%, calc(100% - 2.5rem))` }}
        >
          {describe(hover!)}
        </div>
      )}

      <input
        type="range"
        min={0}
        max={total}
        value={index}
        onChange={(event) => onSeek(Number(event.target.value))}
        onPointerMove={track}
        onPointerDown={track}
        onPointerLeave={() => setHover(null)}
        onPointerCancel={() => setHover(null)}
        aria-label={t('position')}
        aria-valuetext={describe(index)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}

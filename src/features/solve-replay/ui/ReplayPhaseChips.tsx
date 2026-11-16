import { cn } from '@/shared/lib/utils'
import type { PhaseRange } from '@/features/solve-replay/lib/replayTimeline'

interface ReplayPhaseChipsProps {
  ranges: readonly PhaseRange[]
  active: number
  onSelect: (moveIndex: number) => void
}

export default function ReplayPhaseChips({ ranges, active, onSelect }: ReplayPhaseChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {ranges.map((range, i) => {
        const isActive = i === active
        return (
          <button
            key={range.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(range.start)}
            className={cn(
              'inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-medium transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:py-1.5',
              isActive
                ? 'border-foreground/30 bg-muted text-foreground'
                : 'border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <span className={cn('size-1.5 shrink-0', range.lineClass, i > active && 'opacity-40')} />
            {range.name}
            <span className={cn('font-mono tabular-nums', isActive ? range.labelClass : 'opacity-70')}>
              {range.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

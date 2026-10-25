import { cn } from '@/shared/lib/utils'

type LineStyle = 'solid' | 'dashed' | 'dotted' | 'steps'

export interface LegendEntry {
  key: string
  label: string
  color: string
  style: LineStyle
  active: boolean
  onToggle: () => void
}

interface LineGraphLegendProps {
  entries: LegendEntry[]
}

function swatch(entry: LegendEntry) {
  if (entry.style === 'dashed') return `repeating-linear-gradient(to right, ${entry.color} 0 3px, transparent 3px 5px)`
  if (entry.style === 'dotted')
    return `repeating-linear-gradient(to right, ${entry.color} 0 1.5px, transparent 1.5px 3px)`
  return entry.color
}

export default function LineGraphLegend({ entries }: LineGraphLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {entries.map((entry) => (
        <button
          key={entry.key}
          type="button"
          aria-pressed={entry.active}
          onClick={entry.onToggle}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium transition-colors',
            entry.active
              ? 'border-border/60 bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]'
              : 'border-dashed border-border/50 text-muted-foreground/60 hover:text-muted-foreground'
          )}
        >
          {entry.style === 'steps' ? (
            <svg aria-hidden width="12" height="8" viewBox="0 0 12 8" className={cn(!entry.active && 'opacity-40')}>
              <path d="M0 2 H5 V6 H12" fill="none" stroke={entry.color} strokeWidth="2" />
            </svg>
          ) : (
            <span
              aria-hidden
              className={cn('inline-block h-[2px] w-3', !entry.active && 'opacity-40')}
              style={{ background: swatch(entry) }}
            />
          )}
          <span className="tabular-nums">{entry.label}</span>
        </button>
      ))}
    </div>
  )
}

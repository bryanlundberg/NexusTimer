'use client'

import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import type { MoveSpan, PhaseRange } from '@/features/solve-replay/lib/replayTimeline'

interface ReplayMoveListProps {
  label: string
  moves: readonly string[]
  index: number
  onSelect: (index: number) => void
  lines?: readonly PhaseRange[]
  groups?: readonly MoveSpan[]
}

export default function ReplayMoveList({
  label,
  moves,
  index,
  onSelect,
  lines = [],
  groups = []
}: ReplayMoveListProps) {
  const current = index - 1

  const move = (i: number) => (
    <button
      key={i}
      type="button"
      onClick={() => onSelect(i + 1)}
      className={cn(
        'px-[0.2em] transition-colors duration-[var(--dur-fast)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        i === current
          ? 'bg-foreground text-background hover:text-background'
          : i < current
            ? 'text-foreground'
            : 'text-muted-foreground/70'
      )}
    >
      {moves[i]}
    </button>
  )

  const tokens = (start: number, end: number) => {
    const out: ReactNode[] = []
    let i = start
    while (i < end) {
      const group = groups.find((span) => span.start === i && span.end <= end)
      if (group) {
        const members: ReactNode[] = []
        for (let k = group.start; k < group.end; k++) members.push(move(k))
        out.push(
          <span
            key={`g${i}`}
            className="inline-flex whitespace-nowrap rounded-br-[0.4em] bg-primary/15 px-[0.15em] [corner-shape:bevel]"
          >
            {members}
          </span>
        )
        i = group.end
      } else {
        out.push(move(i))
        i++
      }
    }
    return out
  }

  return (
    <div className="surface surface-panel w-full p-3 text-foreground sm:p-4">
      <span className="mb-2 block text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="font-display text-sm font-medium leading-relaxed">
        {lines.length > 0 ? (
          <ol className="flex flex-col gap-1">
            {lines.map((line) => (
              <li key={line.key} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-2">
                <span className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                  <span className={cn('size-1.5 shrink-0', line.lineClass)} />
                  {line.name}
                </span>
                <span className="flex flex-wrap gap-x-0.5">
                  {line.end > line.start ? (
                    tokens(line.start, line.end)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-1">{tokens(0, moves.length)}</div>
        )}
      </div>
    </div>
  )
}

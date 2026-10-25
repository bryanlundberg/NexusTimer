'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import formatTime from '@/shared/lib/formatTime'
import getAoTolerance from '@/shared/lib/statistics/getAoTolerance'
import { cn } from '@/shared/lib/utils'
import { Solve } from '@/entities/solve/model/types'
import { AsideRecord } from '@/widgets/page-aside/lib/asideStats'

interface RecordRowProps {
  record: AsideRecord
  label: string
  when: string
  onOpenSolve: (solve: Solve) => void
}

export default function RecordRow({ record, label, when, onOpenSolve }: RecordRowProps) {
  const [expanded, setExpanded] = useState(false)
  const aoWindow = record.window

  const trimmed = useMemo(() => {
    if (!aoWindow) return new Set<string>()
    const trim = getAoTolerance(record.size)
    const sorted = [...aoWindow].sort((a, b) => (a.dnf ? Infinity : a.time) - (b.dnf ? Infinity : b.time))
    return new Set([...sorted.slice(0, trim), ...sorted.slice(sorted.length - trim)].map((solve) => solve.id))
  }, [aoWindow, record.size])

  const handleClick = () => {
    if (record.solve) onOpenSolve(record.solve)
    else setExpanded((value) => !value)
  }

  return (
    <div className={cn('relative', expanded && 'bg-foreground/[0.03]')}>
      {expanded && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={aoWindow ? expanded : undefined}
        className="group flex w-full cursor-pointer items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-accent/50"
      >
        <span className="w-12 shrink-0 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{when}</span>
        <span
          className={cn(
            'font-mono text-sm font-semibold tabular-nums',
            record.size === 1 ? 'text-record' : 'text-foreground'
          )}
        >
          {formatTime(record.value)}
        </span>
        <ChevronDown
          className={cn(
            'size-3.5 shrink-0 text-muted-foreground transition-transform',
            !aoWindow && '-rotate-90 opacity-0 group-hover:opacity-100',
            expanded && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && aoWindow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid max-h-48 grid-cols-5 gap-1 overflow-y-auto px-2 pb-2.5 pt-0.5 scrollbar-hide">
              {[...aoWindow].reverse().map((solve) => {
                const isTrimmed = trimmed.has(solve.id)
                const time = solve.dnf ? 'DNF' : formatTime(solve.time)
                return (
                  <button
                    key={solve.id}
                    type="button"
                    onClick={() => onOpenSolve(solve)}
                    className={cn(
                      'cursor-pointer truncate bg-foreground/[0.04] px-1 py-1 text-center font-mono text-[11px] tabular-nums transition-colors hover:bg-accent',
                      isTrimmed ? 'text-muted-foreground' : 'text-foreground',
                      solve.dnf && 'text-destructive'
                    )}
                  >
                    {isTrimmed ? `(${time})` : time}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

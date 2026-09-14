'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'

const TREND_SIZE = 40
const MIN_BAR = 18

interface SolvesTrendProps {
  solves: Solve[]
  bestTime: number | null
  className?: string
}

export default function SolvesTrend({ solves, bestTime, className }: SolvesTrendProps) {
  const trend = useMemo(() => {
    const recent = solves.slice(0, TREND_SIZE).reverse()
    const times = recent.filter((solve) => !solve.dnf).map((solve) => solve.time)
    if (times.length < 2) return null

    const min = Math.min(...times)
    const max = Math.max(...times)
    const span = max - min
    const heightOf = (time: number) => (span === 0 ? 60 : MIN_BAR + ((time - min) / span) * (100 - MIN_BAR))
    const mean = times.reduce((sum, time) => sum + time, 0) / times.length

    return {
      meanHeight: heightOf(mean),
      bars: recent.map((solve, index) => ({
        id: solve.id,
        dnf: solve.dnf,
        height: solve.dnf ? 100 : heightOf(solve.time),
        isBest: !solve.dnf && solve.time === bestTime,
        isLatest: index === recent.length - 1,
        title: solve.dnf ? 'DNF' : formatTime(solve.time)
      }))
    }
  }, [solves, bestTime])

  if (!trend) return null

  return (
    <div className={cn('relative mt-2 h-10', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 border-t border-dashed border-primary/40"
        style={{ bottom: `${trend.meanHeight}%` }}
      />
      <div className="flex h-full items-end justify-end gap-[2px]">
        {trend.bars.map((bar) => (
          <motion.span
            key={bar.id}
            layout="position"
            title={bar.title}
            initial={{ height: 0 }}
            animate={{ height: `${bar.height}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'min-w-0 max-w-1.5 flex-1 rounded-t-[1px]',
              bar.dnf
                ? 'bg-destructive/20'
                : bar.isBest
                  ? 'bg-amber-500'
                  : bar.isLatest
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
            )}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import { formatTime, penaltyDotClass } from '@/features/trainer/lib/trainerUtils'
import { cn } from '@/shared/lib/utils'

interface TrainerSolveTimeCellProps {
  timeMs: number
  penalty: TrainerPenalty
  targetMs?: number
}

export default function TrainerSolveTimeCell({ timeMs, penalty, targetMs }: TrainerSolveTimeCellProps) {
  const formatted = formatTime(timeMs, penalty)
  const [main, decimal] = formatted.includes('.') ? formatted.split('.') : [formatted, null]

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('size-1.5 rounded-full shrink-0', penaltyDotClass(penalty, timeMs, targetMs))} />
      <div
        className={cn(
          'flex items-baseline gap-0.5 tabular-nums',
          penalty === 'DNF' && 'text-muted-foreground line-through',
          penalty === '+2' && 'text-cube-orange'
        )}
      >
        <span className="text-sm font-semibold">{main}</span>
        {decimal && <span className="text-xs text-muted-foreground">.{decimal}</span>}
      </div>
    </div>
  )
}

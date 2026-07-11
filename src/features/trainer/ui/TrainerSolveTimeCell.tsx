'use client'

import { formatMs, timeDotClass } from '@/features/trainer/lib/trainerUtils'
import { cn } from '@/shared/lib/utils'

interface TrainerSolveTimeCellProps {
  timeMs: number
  targetMs?: number
}

export default function TrainerSolveTimeCell({ timeMs, targetMs }: TrainerSolveTimeCellProps) {
  const [main, decimal] = formatMs(timeMs).split('.')

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('size-1.5 rounded-full shrink-0', timeDotClass(timeMs, targetMs))} />
      <div className="flex items-baseline gap-0.5 tabular-nums">
        <span className="text-sm font-semibold">{main}</span>
        {decimal && <span className="text-xs text-muted-foreground">.{decimal}</span>}
      </div>
    </div>
  )
}

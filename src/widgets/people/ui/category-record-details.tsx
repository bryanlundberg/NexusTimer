import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import type { CategoryStats } from '@/entities/user-stats/model/types'
import { RecordSolvesStrip } from '@/widgets/people/ui/record-solves-strip'
import { ao5EdgesOf, formatAo5Window } from '@/widgets/people/lib/ao5-window'

interface CategoryRecordDetailsProps {
  stats: CategoryStats
  className?: string
}

export function CategoryRecordDetails({ stats, className }: CategoryRecordDetailsProps) {
  const { category, best, bestAo5 } = stats
  const ao5Window = bestAo5?.window ?? null
  const ao5Edges = React.useMemo(() => ao5EdgesOf(ao5Window), [ao5Window])
  const hasSolves = Boolean(best?.solve || bestAo5?.solves)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {ao5Window && ao5Edges && !bestAo5?.solves && (
        <span className="text-[11px] text-muted-foreground tabular-nums">{formatAo5Window(ao5Window, ao5Edges)}</span>
      )}
      {hasSolves && (
        <RecordSolvesStrip single={best?.solve} ao5={bestAo5?.solves} ao5Edges={ao5Edges} category={category} />
      )}
    </div>
  )
}

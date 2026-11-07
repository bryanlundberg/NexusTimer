import * as React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import type { AoWindowSolve, CategoryStats } from '@/entities/user-stats/model/types'
import { RecordSolvesStrip } from '@/widgets/people/ui/record-solves-strip'
import { RecordDetailGroup } from '@/widgets/people/ui/record-detail-group'
import { RecordDetailRow } from '@/widgets/people/ui/record-detail-row'

interface CategoryRecordDetailsProps {
  stats: CategoryStats
  className?: string
}

export function CategoryRecordDetails({ stats, className }: CategoryRecordDetailsProps) {
  const { category, best, bestAo5 } = stats
  const locale = useLocale()
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const tTimeline = useTranslations('Index.PeoplePage.timeline-tab')

  const bestStr = best ? formatTime(best.time) : '--'
  const ao5Str = bestAo5 ? formatTime(bestAo5.time) : '--'
  const ao5Window = bestAo5?.window ?? null

  const ao5Edges = React.useMemo(() => {
    if (!ao5Window) return null
    const sorted = [...ao5Window].sort((a, b) => (a.dnf ? Infinity : a.time) - (b.dnf ? Infinity : b.time))
    return { bestId: sorted[0].id, worstId: sorted[sorted.length - 1].id }
  }, [ao5Window])

  return (
    <div className={cn('flex flex-wrap gap-x-10 gap-y-3', className)}>
      <RecordDetailGroup title={tSolveCard('single')} value={bestStr}>
        <RecordDetailRow label={tTimeline('col-cube-record')} value={best?.cubeName ?? '--'} />
        <RecordDetailRow
          label={tTimeline('col-date')}
          value={best ? dayjs(best.endTime).locale(locale).format('LL') : '--'}
        />
      </RecordDetailGroup>

      <RecordDetailGroup
        title={tCubes('col-ao5')}
        value={ao5Str}
        extra={
          ao5Window && ao5Edges && !bestAo5?.solves ? (
            <span className="text-[11px] text-muted-foreground tabular-nums">{`[${ao5Window
              .map((solve) => {
                const label = formatSolveLabel(solve)
                const isEdge = solve.id === ao5Edges.bestId || solve.id === ao5Edges.worstId
                return isEdge ? `(${label})` : label
              })
              .join(' ')}]`}</span>
          ) : null
        }
      >
        <RecordDetailRow label={tTimeline('col-cube-record')} value={bestAo5?.cubeName ?? '--'} />
        <RecordDetailRow
          label={tTimeline('col-date')}
          value={bestAo5 ? dayjs(bestAo5.endTime).locale(locale).format('LL') : '--'}
        />
      </RecordDetailGroup>

      {(best?.solve || bestAo5?.solves) && (
        <RecordSolvesStrip single={best?.solve} ao5={bestAo5?.solves} ao5Edges={ao5Edges} category={category} />
      )}
    </div>
  )
}

function formatSolveLabel(solve: AoWindowSolve): string {
  return solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
}

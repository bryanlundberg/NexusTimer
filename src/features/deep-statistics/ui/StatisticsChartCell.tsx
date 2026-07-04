import { cn } from '@/shared/lib/utils'
import { ColumnGroup } from '@/features/deep-statistics/model/statisticsChartConfig'

interface StatisticsChartCellProps {
  isLoading: boolean
  value: string | number
  highlight?: boolean
  group: ColumnGroup
}

export default function StatisticsChartCell({ isLoading, value, highlight, group }: StatisticsChartCellProps) {
  const displayValue = isLoading ? '--' : value
  const isEmpty = displayValue === '--'

  return (
    <div className="flex items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5">
      <span
        className={cn(
          'tabular-nums font-mono text-[11px] sm:text-sm leading-none transition-colors',
          isEmpty && 'text-muted-foreground/40',
          !isEmpty && group === 'cube' && 'text-foreground',
          !isEmpty && highlight && 'font-bold text-primary'
        )}
      >
        {displayValue}
      </span>
    </div>
  )
}

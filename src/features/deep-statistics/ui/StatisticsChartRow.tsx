import { cn } from '@/shared/lib/utils'
import { ColumnDef, ColumnGroup, RowDef, ROW_GRID } from '@/features/deep-statistics/model/statisticsChartConfig'
import GroupBlock from './GroupBlock'

interface StatisticsChartRowProps {
  row: RowDef
  columns: ColumnDef[]
  isLoading: boolean
  activeGroup: ColumnGroup
}

export default function StatisticsChartRow({ row, columns, isLoading, activeGroup }: StatisticsChartRowProps) {
  const personalCols = columns.filter((c) => c.group === 'personal')
  const cubeCols = columns.filter((c) => c.group === 'cube')

  return (
    <div
      className={cn(
        ROW_GRID,
        'group rounded-none px-1 transition-colors hover:bg-primary/5 hover:shadow-[inset_2px_0_0_var(--primary)]',
        row.highlight && 'bg-primary/[0.06] shadow-[inset_2px_0_0_var(--primary)]'
      )}
    >
      {/* Metric label */}
      <div className="flex items-center px-1.5 py-2 sm:px-2">
        <span
          className={cn(
            'truncate text-xs font-medium sm:text-sm',
            row.highlight ? 'font-semibold text-primary' : 'text-foreground'
          )}
        >
          {row.label}
        </span>
      </div>

      <GroupBlock group="personal" columns={personalCols} row={row} isLoading={isLoading} activeGroup={activeGroup} />
      <GroupBlock group="cube" columns={cubeCols} row={row} isLoading={isLoading} activeGroup={activeGroup} />
    </div>
  )
}

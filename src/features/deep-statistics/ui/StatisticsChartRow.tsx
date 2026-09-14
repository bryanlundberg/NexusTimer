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
  const Icon = row.icon

  return (
    <div
      className={cn(
        ROW_GRID,
        'group rounded-none px-1 transition-colors',
        row.highlight
          ? 'bg-amber-500/[0.07] shadow-[inset_2px_0_0_var(--color-amber-500)] hover:bg-amber-500/10'
          : 'hover:bg-primary/5 hover:shadow-[inset_2px_0_0_var(--primary)]'
      )}
    >
      {/* Metric label */}
      <div className="flex min-w-0 items-center gap-2 px-1.5 py-2 sm:px-2">
        <Icon
          aria-hidden
          className={cn(
            'hidden size-3.5 shrink-0 transition-colors sm:block',
            row.highlight ? 'text-amber-500' : 'text-muted-foreground/60 group-hover:text-primary'
          )}
        />
        <span
          className={cn(
            'truncate text-xs font-medium sm:text-sm',
            row.highlight ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-foreground'
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

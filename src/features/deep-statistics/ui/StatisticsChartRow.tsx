import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/shared/lib/utils'
import { ColumnDef, RowDef, STICKY_CELL_BASE } from '@/features/deep-statistics/model/statisticsChartConfig'
import StatisticsChartCell from './StatisticsChartCell'

interface StatisticsChartRowProps {
  row: RowDef
  columns: ColumnDef[]
  isLoading: boolean
}

export default function StatisticsChartRow({ row, columns, isLoading }: StatisticsChartRowProps) {
  const Icon = row.icon

  return (
    <TableRow className="border-b border-border/60 transition-colors group">
      <TableCell
        className={cn(
          STICKY_CELL_BASE,
          'font-medium text-xs sm:text-sm py-2.5 px-3 group-hover:bg-muted transition-colors',
          row.highlight && 'text-primary font-semibold'
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className={cn('size-3.5 shrink-0', row.highlight ? 'text-primary' : 'text-muted-foreground/60')} />
          <span className="truncate">{row.label}</span>
        </div>
      </TableCell>

      {columns.map((column, idx) => {
        const prevGroup = idx > 0 ? columns[idx - 1].group : null
        const isGroupStart = column.group !== prevGroup
        return (
          <StatisticsChartCell
            key={column.key}
            isLoading={isLoading}
            value={row.getValue(column.scope)}
            highlight={row.highlight}
            groupStart={isGroupStart}
            group={column.group}
          />
        )
      })}
    </TableRow>
  )
}

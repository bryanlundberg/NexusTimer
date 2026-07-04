import { cn } from '@/shared/lib/utils'
import {
  ColumnDef,
  ColumnGroup,
  GROUP_BLOCK,
  GROUP_INNER_GRID,
  RowDef
} from '@/features/deep-statistics/model/statisticsChartConfig'
import StatisticsChartCell from './StatisticsChartCell'

interface GroupBlockProps {
  group: ColumnGroup
  columns: ColumnDef[]
  row: RowDef
  isLoading: boolean
}

export default function GroupBlock({ group, columns, row, isLoading }: GroupBlockProps) {
  return (
    <div className={cn(GROUP_BLOCK[group], GROUP_INNER_GRID)}>
      {columns.map((column) => (
        <StatisticsChartCell
          key={column.key}
          isLoading={isLoading}
          value={row.getValue(column.scope)}
          highlight={row.highlight}
          group={group}
        />
      ))}
    </div>
  )
}

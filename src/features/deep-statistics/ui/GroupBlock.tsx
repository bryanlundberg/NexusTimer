import { cn } from '@/shared/lib/utils'
import {
  ColumnDef,
  ColumnGroup,
  groupBlockClass,
  GROUP_INNER_GRID,
  groupVisibility,
  RowDef
} from '@/features/deep-statistics/model/statisticsChartConfig'
import StatisticsChartCell from './StatisticsChartCell'

interface GroupBlockProps {
  group: ColumnGroup
  columns: ColumnDef[]
  row: RowDef
  isLoading: boolean
  activeGroup: ColumnGroup
}

export default function GroupBlock({ group, columns, row, isLoading, activeGroup }: GroupBlockProps) {
  return (
    <div className={cn(groupBlockClass(group, activeGroup), GROUP_INNER_GRID, groupVisibility(group, activeGroup))}>
      {columns.map((column) => (
        <StatisticsChartCell
          key={column.key}
          isLoading={isLoading}
          value={row.getValue(column.scope)}
          highlight={row.highlight}
          isActiveGroup={group === activeGroup}
        />
      ))}
    </div>
  )
}

'use client'

import { DeepStatistics } from '@/shared/types/statistics'
import {
  ColumnGroup,
  useStatisticsColumns,
  useStatisticsRows
} from '@/features/deep-statistics/model/statisticsChartConfig'
import StatisticsChartHeader from './StatisticsChartHeader'
import StatisticsChartRow from './StatisticsChartRow'

interface StatisticsChartProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
  activeGroup: ColumnGroup
}

export default function StatisticsChart({ statistics, loadingProps, activeGroup }: StatisticsChartProps) {
  const columns = useStatisticsColumns()
  const rows = useStatisticsRows(statistics)

  return (
    <div className="mb-2 bg-background/60">
      <StatisticsChartHeader columns={columns} activeGroup={activeGroup} />
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <StatisticsChartRow
            key={row.label}
            row={row}
            columns={columns}
            isLoading={loadingProps[row.loadingKey]}
            activeGroup={activeGroup}
          />
        ))}
      </div>
    </div>
  )
}

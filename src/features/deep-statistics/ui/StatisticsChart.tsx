import { Table, TableBody } from '@/components/ui/table'
import { DeepStatistics } from '@/shared/types/statistics'
import { motion } from 'framer-motion'
import { useStatisticsColumns, useStatisticsRows } from '@/features/deep-statistics/model/statisticsChartConfig'
import StatisticsChartHeader from './StatisticsChartHeader'
import StatisticsChartRow from './StatisticsChartRow'

interface StatisticsChartProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
}

export default function StatisticsChart({ statistics, loadingProps }: StatisticsChartProps) {
  const columns = useStatisticsColumns()
  const rows = useStatisticsRows(statistics)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-background overflow-hidden mb-2"
    >
      <Table>
        <StatisticsChartHeader columns={columns} />
        <TableBody>
          {rows.map((row) => (
            <StatisticsChartRow key={row.label} row={row} columns={columns} isLoading={loadingProps[row.loadingKey]} />
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}

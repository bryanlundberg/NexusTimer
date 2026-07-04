'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import { DeepStatistics } from '@/shared/types/statistics'
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
  const reduceMotion = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.04,
        delayChildren: reduceMotion ? 0 : 0.05
      }
    }
  }

  return (
    <div className="mb-2 rounded-2xl border border-border/50 bg-background/60 p-2 sm:p-3">
      <StatisticsChartHeader columns={columns} />
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-1">
        {rows.map((row) => (
          <StatisticsChartRow key={row.label} row={row} columns={columns} isLoading={loadingProps[row.loadingKey]} />
        ))}
      </motion.div>
    </div>
  )
}

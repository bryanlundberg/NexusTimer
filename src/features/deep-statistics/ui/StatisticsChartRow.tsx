import { motion, useReducedMotion, type Variants } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { ColumnDef, RowDef, ROW_GRID } from '@/features/deep-statistics/model/statisticsChartConfig'
import GroupBlock from './GroupBlock'

interface StatisticsChartRowProps {
  row: RowDef
  columns: ColumnDef[]
  isLoading: boolean
}

export default function StatisticsChartRow({ row, columns, isLoading }: StatisticsChartRowProps) {
  const reduceMotion = useReducedMotion()
  const personalCols = columns.filter((c) => c.group === 'personal')
  const cubeCols = columns.filter((c) => c.group === 'cube')

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.div
      variants={item}
      className={cn(
        ROW_GRID,
        'group rounded-xl px-1 transition-colors hover:bg-muted/40',
        row.highlight && 'bg-primary/[0.04]'
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

      <GroupBlock group="personal" columns={personalCols} row={row} isLoading={isLoading} />
      <GroupBlock group="cube" columns={cubeCols} row={row} isLoading={isLoading} />
    </motion.div>
  )
}

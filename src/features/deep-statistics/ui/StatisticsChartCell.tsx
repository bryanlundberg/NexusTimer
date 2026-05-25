import { TableCell } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GROUP_DIVIDER_LEFT } from '@/features/deep-statistics/model/statisticsChartConfig'

interface StatisticsChartCellProps {
  isLoading: boolean
  value: string | number
  highlight?: boolean
  groupStart?: boolean
}

export default function StatisticsChartCell({ isLoading, value, highlight, groupStart }: StatisticsChartCellProps) {
  if (isLoading) {
    return (
      <TableCell
        className={cn('text-center group-hover:bg-muted/40 transition-colors', groupStart && GROUP_DIVIDER_LEFT)}
      >
        <Loader2 className="size-4 animate-spin text-muted-foreground/50 mx-auto" />
      </TableCell>
    )
  }
  return (
    <TableCell
      className={cn(
        'text-center tabular-nums font-mono text-[11px] sm:text-sm group-hover:bg-muted/40 transition-colors',
        groupStart && GROUP_DIVIDER_LEFT,
        highlight && value !== '--' && 'text-primary font-bold'
      )}
    >
      {value}
    </TableCell>
  )
}

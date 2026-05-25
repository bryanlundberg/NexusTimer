import { TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Boxes, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { ColumnDef, GROUP_DIVIDER_LEFT, STICKY_CELL_BASE } from '@/features/deep-statistics/model/statisticsChartConfig'

interface StatisticsChartHeaderProps {
  columns: ColumnDef[]
}

export default function StatisticsChartHeader({ columns }: StatisticsChartHeaderProps) {
  const t = useTranslations('Index')
  const personalColCount = columns.filter((c) => c.group === 'personal').length
  const cubeColCount = columns.filter((c) => c.group === 'cube').length

  return (
    <TableHeader>
      <TableRow className="border-b-0 hover:bg-transparent">
        <TableHead
          rowSpan={2}
          className={cn(
            STICKY_CELL_BASE,
            'top-0 z-30 w-40 min-w-40 align-bottom pb-2 pt-3 px-3',
            'font-semibold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-1.5">
            <Boxes className="size-3.5" />
            <span>{t('StatsPage.title')}</span>
          </div>
        </TableHead>
        <TableHead
          colSpan={personalColCount}
          className={cn(
            'sticky top-0 z-20 bg-muted text-center py-2',
            'text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70',
            GROUP_DIVIDER_LEFT
          )}
        >
          <div className="inline-flex items-center gap-1.5">
            <User className="size-3" />
            <span>Personal</span>
          </div>
        </TableHead>
        <TableHead
          colSpan={cubeColCount}
          className={cn(
            'sticky top-0 z-20 bg-muted text-center py-2',
            'text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-primary/80',
            GROUP_DIVIDER_LEFT
          )}
        >
          <div className="inline-flex items-center gap-1.5">
            <Boxes className="size-3" />
            <span>Cube</span>
          </div>
        </TableHead>
      </TableRow>

      <TableRow className="border-b border-border/40 bg-muted hover:bg-muted">
        {columns.map((column, idx) => {
          const prevGroup = idx > 0 ? columns[idx - 1].group : null
          const isGroupStart = column.group !== prevGroup
          return (
            <TableHead
              key={column.key}
              className={cn('sticky top-9 z-20 bg-muted text-center py-2 min-w-30', isGroupStart && GROUP_DIVIDER_LEFT)}
            >
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground cursor-help">
                      {column.label}
                      <InformationCircleIcon className="size-3.5 opacity-50" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>{column.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}

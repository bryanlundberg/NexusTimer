import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  ColumnDef,
  ColumnGroup,
  GROUP_BLOCK,
  GROUP_INNER_GRID
} from '@/features/deep-statistics/model/statisticsChartConfig'

interface ColumnLabelsProps {
  group: ColumnGroup
  columns: ColumnDef[]
}

export default function ColumnLabels({ group, columns }: ColumnLabelsProps) {
  return (
    <div className={cn(GROUP_BLOCK[group], GROUP_INNER_GRID, 'py-1.5')}>
      {columns.map((column) => (
        <TooltipProvider key={column.key} delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-1 px-1 cursor-help">
                <span
                  className={cn(
                    'truncate text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider',
                    group === 'cube' ? 'text-primary/80' : 'text-muted-foreground'
                  )}
                >
                  {column.label}
                </span>
                <Info className="size-3 shrink-0 opacity-40" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>{column.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

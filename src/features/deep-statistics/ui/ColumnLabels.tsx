import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  ColumnDef,
  ColumnGroup,
  groupBlockClass,
  GROUP_INNER_GRID,
  groupVisibility
} from '@/features/deep-statistics/model/statisticsChartConfig'

interface ColumnLabelsProps {
  group: ColumnGroup
  columns: ColumnDef[]
  activeGroup: ColumnGroup
}

export default function ColumnLabels({ group, columns, activeGroup }: ColumnLabelsProps) {
  return (
    <div
      className={cn(
        groupBlockClass(group, activeGroup),
        GROUP_INNER_GRID,
        'py-1.5',
        groupVisibility(group, activeGroup)
      )}
    >
      {columns.map((column) => (
        <Tooltip key={column.key}>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 px-1 cursor-help">
              <span
                className={cn(
                  'truncate text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider',
                  group === activeGroup ? 'text-primary/80' : 'text-muted-foreground'
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
      ))}
    </div>
  )
}

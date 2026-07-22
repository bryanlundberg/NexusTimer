import { cn } from '@/shared/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  ColumnDef,
  ColumnGroup,
  groupVisibility,
  ROW_GRID
} from '@/features/deep-statistics/model/statisticsChartConfig'
import GroupChip from './GroupChip'
import ColumnLabels from './ColumnLabels'

interface StatisticsChartHeaderProps {
  columns: ColumnDef[]
  activeGroup: ColumnGroup
}

export default function StatisticsChartHeader({ columns, activeGroup }: StatisticsChartHeaderProps) {
  const personalCols = columns.filter((c) => c.group === 'personal')
  const cubeCols = columns.filter((c) => c.group === 'cube')

  return (
    <div className="sticky top-0 z-20 -mx-1 mb-2 bg-background/90 px-1 pb-1 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Group chips */}
      <div className={ROW_GRID}>
        <div aria-hidden />
        <div className={groupVisibility('personal', activeGroup, 'block')}>
          <GroupChip group="personal" label="Personal" activeGroup={activeGroup} />
        </div>
        <div className={groupVisibility('cube', activeGroup, 'block')}>
          <GroupChip group="cube" label="Cube" activeGroup={activeGroup} />
        </div>
      </div>

      {/* Scope sub-labels */}
      <TooltipProvider delayDuration={200}>
        <div className={cn(ROW_GRID, 'mt-1.5')}>
          <div aria-hidden />
          <ColumnLabels group="personal" columns={personalCols} activeGroup={activeGroup} />
          <ColumnLabels group="cube" columns={cubeCols} activeGroup={activeGroup} />
        </div>
      </TooltipProvider>
    </div>
  )
}

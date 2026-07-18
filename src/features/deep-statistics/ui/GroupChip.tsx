import { Boxes, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ColumnGroup, groupChipClass } from '@/features/deep-statistics/model/statisticsChartConfig'

const GROUP_ICON: Record<ColumnGroup, typeof User> = {
  personal: User,
  cube: Boxes
}

interface GroupChipProps {
  group: ColumnGroup
  label: string
  activeGroup: ColumnGroup
}

export default function GroupChip({ group, label, activeGroup }: GroupChipProps) {
  const Icon = GROUP_ICON[group]
  return (
    <div className="flex items-center justify-center">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
          'text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em]',
          groupChipClass(group, activeGroup)
        )}
      >
        <Icon className="size-3" />
        {label}
      </span>
    </div>
  )
}

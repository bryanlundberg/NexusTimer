import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RenderableBadge } from '../model/types'
import { AchievementIcon } from './achievement-icon'
import { AchievementTooltip } from './achievement-tooltip'

interface AchievementItemProps {
  achievement: RenderableBadge
  locked?: boolean
  disableTooltip?: boolean
  level?: number
  maxLevel?: number
}

export function AchievementItem({
  achievement,
  locked = false,
  disableTooltip = false,
  level,
  maxLevel
}: AchievementItemProps) {
  const icon = <AchievementIcon achievement={achievement} locked={locked} level={level} maxLevel={maxLevel} />

  if (disableTooltip) return icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <AchievementTooltip achievement={achievement} />
      </Tooltip>
    </TooltipProvider>
  )
}

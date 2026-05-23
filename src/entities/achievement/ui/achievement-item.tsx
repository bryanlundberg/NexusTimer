import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Achievement as AchievementType } from '../model/types'
import { AchievementIcon } from './achievement-icon'
import { AchievementTooltip } from './achievement-tooltip'

interface AchievementItemProps {
  achievement: AchievementType
  locked?: boolean
  disableTooltip?: boolean
}

export function AchievementItem({ achievement, locked = false, disableTooltip = false }: AchievementItemProps) {
  if (disableTooltip) {
    return <AchievementIcon achievement={achievement} locked={locked} />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <AchievementIcon achievement={achievement} locked={locked} />
        </TooltipTrigger>
        <AchievementTooltip achievement={achievement} />
      </Tooltip>
    </TooltipProvider>
  )
}

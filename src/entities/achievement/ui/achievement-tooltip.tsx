import Image from 'next/image'
import { TooltipContent } from '@/components/ui/tooltip'
import { RenderableBadge } from '../model/types'

interface AchievementTooltipProps {
  achievement: RenderableBadge
}

export function AchievementTooltip({ achievement }: AchievementTooltipProps) {
  return (
    <TooltipContent className="menu-panel bg-popover p-2.5 text-popover-foreground">
      <div className="flex items-center justify-center mb-2">
        <Image
          src={`/achievements/${achievement.icon}`}
          unoptimized
          alt={achievement.title}
          width={96}
          height={96}
          className="object-cover size-10"
          draggable={false}
        />
        <div className="ml-3 space-y-1">
          <p className="font-bold text-sm leading-none">{achievement.title}</p>
          <p className="text-xs text-muted-foreground leading-snug">{achievement.description}</p>
        </div>
      </div>
    </TooltipContent>
  )
}

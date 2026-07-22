import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { TooltipContent } from '@/components/ui/tooltip'
import { Achievement as AchievementType } from '../model/types'

interface AchievementTooltipProps {
  achievement: AchievementType
}

export function AchievementTooltip({ achievement }: AchievementTooltipProps) {
  return (
    <TooltipContent className="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-none shadow-lg border border-primary/30">
      <div className="flex items-center justify-center mb-2">
        <Image
          src={`/achievements/${achievement.icon}`}
          unoptimized
          alt={achievement.title}
          width={96}
          height={96}
          className={cn('object-cover size-10 dark:invert')}
          draggable={false}
        />
        <div className="ml-3 space-y-1">
          <p className="font-bold text-sm leading-none">{achievement.title}</p>
          <p className="text-xs text-white/70 dark:text-black/70 leading-snug">{achievement.description}</p>
        </div>
      </div>
    </TooltipContent>
  )
}

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Achievement as AchievementType } from '../model/types'

interface AchievementItemProps {
  achievement: AchievementType
  /** Render greyed-out to indicate the badge has not been earned yet. */
  locked?: boolean
  /** Skip the hover tooltip — useful when the title/description are already rendered next to the icon. */
  disableTooltip?: boolean
}

function Icon({ achievement, locked }: { achievement: AchievementType; locked: boolean }) {
  return (
    <div
      className={cn(
        'aspect-square size-12 rounded-full flex items-center justify-center relative group transition-all duration-300 border-2',
        locked && 'grayscale opacity-40',
        (!achievement.color || locked) &&
          'bg-gradient-to-tr from-neutral-700 to-neutral-600 dark:from-neutral-700 dark:to-neutral-600 border-neutral-50 dark:border-neutral-500'
      )}
      style={achievement.color && !locked ? { backgroundColor: achievement.color, borderColor: achievement.color } : {}}
    >
      <Image
        src={`/achievements/${achievement.icon}`}
        unoptimized
        alt={achievement.title}
        width={96}
        height={96}
        className={cn(
          'object-cover p-2 w-full h-full rounded-full relative z-10 transition-transform group-hover:scale-105'
        )}
        draggable={false}
      />
    </div>
  )
}

export function AchievementItem({ achievement, locked = false, disableTooltip = false }: AchievementItemProps) {
  if (disableTooltip) {
    return <Icon achievement={achievement} locked={locked} />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon achievement={achievement} locked={locked} />
        </TooltipTrigger>
        <TooltipContent className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-md shadow-lg border border-primary">
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
              <p className="text-xs text-muted-foreground leading-snug">{achievement.description}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { Achievement as AchievementType } from '../model/types'

type AchievementIconProps = {
  achievement: AchievementType
  locked: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const AchievementIcon = React.forwardRef<HTMLDivElement, AchievementIconProps>(function AchievementIcon(
  { achievement, locked, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        'aspect-square size-12 rounded-full flex items-center justify-center relative group transition-all duration-300 border-2',
        locked && 'grayscale opacity-40',
        (!achievement.color || locked) &&
          'bg-linear-to-tr from-neutral-700 to-neutral-600 dark:from-neutral-700 dark:to-neutral-600 border-neutral-50 dark:border-neutral-500'
      )}
      style={achievement.color && !locked ? { backgroundColor: achievement.color, borderColor: achievement.color } : {}}
    >
      {achievement.type === 'granted' && !locked && <span aria-hidden className="badge-beam" />}
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
})

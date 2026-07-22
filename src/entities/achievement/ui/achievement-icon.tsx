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
  const color = achievement.color
  const colored = Boolean(color) && !locked

  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        'aspect-square size-12 rounded-full flex items-center justify-center relative group overflow-hidden transition-all duration-300',
        locked && 'grayscale opacity-40',
        !colored && 'bg-gradient-to-tr from-neutral-700 to-neutral-500'
      )}
      style={
        colored
          ? {
              background: `radial-gradient(125% 125% at 30% 18%, color-mix(in oklab, ${color} 72%, white) 0%, ${color} 46%, color-mix(in oklab, ${color} 80%, black) 100%)`,
              boxShadow: `0 3px 10px -2px color-mix(in oklab, ${color} 55%, transparent)`
            }
          : undefined
      }
    >
      {/* glossy top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent"
      />
      {/* inner rim for depth */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />

      {achievement.type === 'granted' && !locked && <span aria-hidden className="badge-beam" />}

      <Image
        src={`/achievements/${achievement.icon}`}
        unoptimized
        alt={achievement.title}
        width={96}
        height={96}
        className="object-cover p-2 w-full h-full relative z-10"
        draggable={false}
      />
    </div>
  )
})

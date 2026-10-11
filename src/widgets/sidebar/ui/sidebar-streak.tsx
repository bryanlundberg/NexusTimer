'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cn } from '@/shared/lib/utils'
import { activityStreak } from '@/widgets/sidebar/lib/activityStreak'

export function SidebarStreak() {
  const t = useTranslations('Index.NavMain')
  const cubes = useTimerStore((store) => store.cubes)
  const { streak, lastWeek } = useMemo(() => activityStreak(cubes), [cubes])

  return (
    <div className="flex items-center justify-between gap-3 border bg-background/40 px-3 py-2">
      <span className="flex min-w-0 items-baseline gap-1.5">
        <span className="font-display text-lg leading-none tabular-nums">{streak}</span>
        <span className="truncate text-[11px] text-muted-foreground">{t('streak-days', { count: streak })}</span>
      </span>
      <span className="flex shrink-0 gap-1" aria-hidden>
        {lastWeek.map((active, i) => (
          <span
            key={i}
            className={cn(
              'size-2.5',
              active ? 'bg-primary' : 'bg-muted-foreground/15',
              i === lastWeek.length - 1 && 'outline outline-1 outline-offset-1 outline-primary/60'
            )}
          />
        ))}
      </span>
    </div>
  )
}

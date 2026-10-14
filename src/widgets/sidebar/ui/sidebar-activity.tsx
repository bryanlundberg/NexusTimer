'use client'

import { useId, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cn } from '@/shared/lib/utils'
import { activityStreak } from '@/widgets/sidebar/lib/activityStreak'
import { useSidebarActivityStore } from '@/widgets/sidebar/model/useSidebarActivityStore'
import { SidebarMonthActivity } from '@/widgets/sidebar/ui/sidebar-month-activity'

export function SidebarActivity() {
  const t = useTranslations('Index.NavMain')
  const cubes = useTimerStore((store) => store.cubes)
  const isOpen = useSidebarActivityStore((store) => store.isOpen)
  const toggle = useSidebarActivityStore((store) => store.toggle)
  const reduceMotion = useReducedMotion()
  const calendarId = useId()
  const { streak, lastWeek } = useMemo(() => activityStreak(cubes), [cubes])

  return (
    <div className="border bg-background/40">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={calendarId}
        className="group flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left"
      >
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="font-display text-lg leading-none tabular-nums">{streak}</span>
          <span className="truncate text-[11px] text-muted-foreground">{t('streak-days', { count: streak })}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {!isOpen && (
            <span className="flex gap-1" aria-hidden>
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
          )}
          <ChevronDown
            aria-hidden
            className={cn(
              'size-3.5 text-muted-foreground transition-transform group-hover:text-foreground motion-reduce:transition-none',
              isOpen && 'rotate-180'
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={calendarId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t px-3 pt-2.5 pb-3">
              <SidebarMonthActivity />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

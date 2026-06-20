'use client'

import { useTranslations } from 'next-intl'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { PLATFORM_ROUTES } from '@/widgets/mobile-bottom-nav/model/platform-routes'
import { usePlatformRouteMatch } from '@/widgets/mobile-bottom-nav/model/use-platform-route-match'
import { MobileBottomNavItem } from '@/widgets/mobile-bottom-nav/ui/MobileBottomNavItem'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'

export function MobileBottomNav() {
  const t = useTranslations('Index.NavMain')
  const { isOnPlatformRoute, isActive } = usePlatformRouteMatch()
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)

  if (!isOnPlatformRoute) return null

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <AnimatePresence initial={false}>
      {!isHidden && (
        <motion.nav
          key="mobile-bottom-nav"
          aria-label={t('platform')}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'mt-auto shrink-0 overflow-hidden md:hidden',
            'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
            'pb-[env(safe-area-inset-bottom)]'
          )}
        >
          <LayoutGroup>
            <ul className="grid grid-cols-4">
              {PLATFORM_ROUTES.map((route) => (
                <li key={route.url} className="flex w-full">
                  <MobileBottomNavItem
                    url={route.url}
                    icon={route.icon}
                    label={t(route.translationKey)}
                    active={isActive(route.url)}
                  />
                </li>
              ))}
            </ul>
          </LayoutGroup>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

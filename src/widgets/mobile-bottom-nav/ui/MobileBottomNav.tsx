'use client'

import { useTranslations } from 'next-intl'
import { LayoutGroup } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { PLATFORM_ROUTES } from '@/widgets/mobile-bottom-nav/model/platform-routes'
import { usePlatformRouteMatch } from '@/widgets/mobile-bottom-nav/model/use-platform-route-match'
import { MobileBottomNavItem } from '@/widgets/mobile-bottom-nav/ui/MobileBottomNavItem'

export function MobileBottomNav() {
  const t = useTranslations('Index.NavMain')
  const { isOnPlatformRoute, isActive } = usePlatformRouteMatch()

  if (!isOnPlatformRoute) return null

  return (
    <nav
      aria-label={t('platform')}
      className={cn(
        'mt-auto shrink-0 md:hidden',
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
    </nav>
  )
}

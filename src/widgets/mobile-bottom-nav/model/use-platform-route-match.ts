'use client'

import { usePathname } from '@/shared/config/i18n/navigation'
import { useMemo } from 'react'
import { PLATFORM_ROUTES, isPathActive } from './platform-routes'

export function usePlatformRouteMatch() {
  const pathname = usePathname() ?? ''

  return useMemo(
    () => ({
      pathname,
      isOnPlatformRoute: PLATFORM_ROUTES.some(({ url }) => isPathActive(pathname, url)),
      isActive: (url: string) => isPathActive(pathname, url)
    }),
    [pathname]
  )
}

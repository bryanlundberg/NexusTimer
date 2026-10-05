'use client'

import { usePathname } from '@/shared/config/i18n/navigation'

export function useRouteSegment(base: string): string {
  const pathname = usePathname()
  if (!pathname.startsWith(`${base}/`)) return ''
  const segment = pathname.slice(base.length + 1).split('/')[0] ?? ''
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

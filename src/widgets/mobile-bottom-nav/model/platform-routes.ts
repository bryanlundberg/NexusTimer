import type { ElementType } from 'react'
import { TimerNavIcon, SolvesNavIcon, StatsNavIcon, CubeNavIcon } from '@/components/ui/nav-icons'

export type PlatformRoute = {
  url: string
  icon: ElementType
  translationKey: string
}

export const PLATFORM_ROUTES: readonly PlatformRoute[] = [
  { url: '/app', icon: TimerNavIcon, translationKey: 'timer' },
  { url: '/solves', icon: SolvesNavIcon, translationKey: 'solves' },
  { url: '/stats', icon: StatsNavIcon, translationKey: 'statistics' },
  { url: '/cubes', icon: CubeNavIcon, translationKey: 'cubes' }
] as const

export const isPathActive = (pathname: string, url: string): boolean =>
  pathname === url || pathname.startsWith(url + '/')

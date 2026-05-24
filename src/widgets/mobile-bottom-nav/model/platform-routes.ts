import { BoxesIcon, ChartColumnIcon, HistoryIcon, TimerIcon, type LucideIcon } from 'lucide-react'

export type PlatformRoute = {
  url: string
  icon: LucideIcon
  translationKey: string
}

export const PLATFORM_ROUTES: readonly PlatformRoute[] = [
  { url: '/app', icon: TimerIcon, translationKey: 'timer' },
  { url: '/solves', icon: HistoryIcon, translationKey: 'solves' },
  { url: '/stats', icon: ChartColumnIcon, translationKey: 'statistics' },
  { url: '/cubes', icon: BoxesIcon, translationKey: 'cubes' }
] as const

export const isPathActive = (pathname: string, url: string): boolean =>
  pathname === url || pathname.startsWith(url + '/')

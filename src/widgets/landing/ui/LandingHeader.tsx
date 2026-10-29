'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import { cn } from '@/shared/lib/utils'
import { pillSmall, pillSolid } from '../lib/pill'

const NAV = [
  { href: '/app', page: 'timer', wide: false },
  { href: '/leaderboards', page: 'leaderboards', wide: false },
  { href: '/people', page: 'community', wide: true },
  { href: '/algorithms/trainer', page: 'trainer', wide: true }
] as const

export default function LandingHeader({ compact }: { compact: boolean }) {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'flex h-16 items-center justify-between gap-4 px-4 transition-colors duration-300 md:px-6',
          compact ? 'bg-transparent' : 'bg-background'
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-brand text-base font-bold leading-tight tracking-tight text-foreground">
            NEXUSTIMER
          </span>
        </Link>

        <nav
          className={cn(
            'hidden items-center gap-1 transition-opacity duration-300 md:flex',
            compact && 'pointer-events-none opacity-0'
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/8 hover:text-foreground',
                item.wide && 'hidden lg:inline-flex'
              )}
            >
              {tPages(`${item.page}.title`)}
            </Link>
          ))}
        </nav>

        <Link href="/app" className={cn(pillSolid, pillSmall)}>
          {t('header.start-timing')}
        </Link>
      </div>
    </header>
  )
}

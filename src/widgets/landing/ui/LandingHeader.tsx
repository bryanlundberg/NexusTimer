'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { pillSmall, pillSolid } from '../lib/pill'
import { headerRow } from '../lib/rails'
import BrandLink from './BrandLink'

const NAV = [
  { href: '/app', page: 'timer', wide: false },
  { href: '/leaderboards', page: 'leaderboards', wide: false },
  { href: '/people', page: 'community', wide: true },
  { href: '/algorithms/trainer', page: 'trainer', wide: true }
] as const

export default function LandingHeader() {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')

  return (
    <header className="relative">
      <div className={headerRow}>
        <div className="md:invisible xl:flex xl:justify-center">
          <BrandLink />
        </div>

        <nav className="hidden items-center gap-1 md:flex xl:justify-center">
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

        <div className="xl:flex xl:justify-center">
          <Link href="/app" className={cn(pillSolid, pillSmall)}>
            {t('header.start-short')}
          </Link>
        </div>
      </div>
      <div
        aria-hidden
        className="lp-rail-x-long pointer-events-none absolute bottom-0 left-1/2 hidden w-[100dvw] -translate-x-1/2 md:block"
      />
    </header>
  )
}

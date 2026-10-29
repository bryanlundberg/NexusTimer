'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { pillSmall, pillSolid } from '../lib/pill'
import { headerRow } from '../lib/rails'
import BrandLink from './BrandLink'

export default function PinnedBar({ showAction }: { showAction: boolean }) {
  const t = useTranslations('LandingPage')

  return (
    <div className="pointer-events-none sticky top-0 z-50 hidden h-0 md:block">
      <div className={cn(headerRow, 'absolute inset-x-0 top-0')}>
        <div className="pointer-events-auto xl:flex xl:justify-center">
          <BrandLink />
        </div>
        <div aria-hidden className="hidden md:block" />
        <div className="xl:flex xl:justify-center">
          <Link
            href="/app"
            tabIndex={showAction ? undefined : -1}
            aria-hidden={!showAction}
            className={cn(
              pillSolid,
              pillSmall,
              'transition-[opacity,translate] duration-300',
              showAction ? 'pointer-events-auto translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            )}
          >
            {t('header.start-short')}
          </Link>
        </div>
      </div>
    </div>
  )
}

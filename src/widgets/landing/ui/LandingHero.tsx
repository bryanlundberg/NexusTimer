'use client'

import { Link } from '@/shared/config/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { preconnect } from 'react-dom'
import { Nexi } from '@/shared/ui/nexi'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { CubeFace } from './CubeFace'

export function LandingHero() {
  const t = useTranslations('LandingPage')
  preconnect('https://cdn.jsdelivr.net')

  return (
    <section className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="dark text-foreground notch-br relative flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center overflow-hidden bg-[var(--lp-hero-dark)] px-6">
        <div className="relative mx-auto w-full max-w-3xl py-24 text-center">
          <h1
            className="lp-rise font-display text-balance text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-foreground md:text-6xl"
            style={{ animationDelay: '0.12s' }}
          >
            {t('hero.title-before')}{' '}
            <span className="whitespace-nowrap">
              <span className="relative inline-block text-primary">
                {t('hero.title-highlight')}
                <span aria-hidden className="lp-underline absolute -bottom-1 left-0 h-[3px] w-full bg-primary/60" />
              </span>
              <span aria-hidden className="ml-[0.18em] inline-block w-[0.66em]" style={{ verticalAlign: '0.14em' }}>
                <CubeFace className="w-full" />
              </span>
            </span>
          </h1>

          <p
            className="lp-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: '0.19s' }}
          >
            {t('hero.subtitle')}
          </p>

          <div
            className="lp-rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.26s' }}
          >
            <Link href="/app" className={cn(buttonVariants({ size: 'xl' }), 'group')}>
              <span className="flex h-6 w-6 items-center justify-center">
                <Nexi
                  state="hello"
                  size={24}
                  className="origin-center -translate-x-1 scale-50 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
                />
              </span>
              {t('hero.cta-primary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/algorithms" className={buttonVariants({ variant: 'outline', size: 'xl' })}>
              {t('hero.cta-secondary')}
            </Link>
          </div>

          <div className="lp-rise mt-10 text-xs text-muted-foreground" style={{ animationDelay: '0.33s' }}>
            <Link href="/people" className="transition-colors hover:text-foreground hover:underline">
              {t('hero.social-proof')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

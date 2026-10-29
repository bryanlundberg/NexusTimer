'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { Nexi } from '@/shared/ui/nexi'
import { pillGhost, pillInverse } from '../lib/pill'
import { cn } from '@/shared/lib/utils'

export default function HeroPanel() {
  const t = useTranslations('LandingPage')

  return (
    <section className="pt-2">
      <div className="lp-panel relative isolate flex min-h-[calc(100dvh-72px)] items-center justify-center overflow-hidden rounded-[16px]">
        <div aria-hidden className="lp-glow" />

        <div className="mx-auto max-w-5xl px-6 pb-[22vh] pt-20 text-center">
          <h1
            className="lp-rise font-[family-name:var(--font-space-grotesk)] text-balance text-[clamp(2.6rem,7vw,5.75rem)] font-medium leading-[1] tracking-[-0.04em]"
            style={{ animationDelay: '0.35s' }}
          >
            {t('hero.title-before')} {t('hero.title-highlight')}
          </h1>
          <p
            className="lp-rise mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: '0.5s' }}
          >
            {t('hero.subtitle')}
          </p>
          <div
            className="lp-rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.65s' }}
          >
            <Link href="/app" className={cn(pillInverse, 'group')}>
              <Nexi state="hello" size={22} className="-ml-1" />
              {t('hero.cta-primary')}
            </Link>
            <Link href="/algorithms" className={pillGhost}>
              {t('hero.cta-secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

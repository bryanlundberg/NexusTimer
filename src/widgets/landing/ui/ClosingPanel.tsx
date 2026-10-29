'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { pillGhost, pillInverse } from '../lib/pill'

export default function ClosingPanel() {
  const t = useTranslations('LandingPage')

  return (
    <section className="px-2 pt-32 md:pt-44">
      <div className="lp-panel relative isolate overflow-hidden rounded-[16px]">
        <div aria-hidden className="lp-glow lp-glow-top" />
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-[28vh] text-center md:pb-32">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.04em]">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">{t('cta.subtitle')}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/app" className={cn(pillInverse, 'group')}>
              <Image
                src="/landing/cube.gif"
                alt=""
                width={20}
                height={20}
                unoptimized
                style={{ width: 20, height: 20 }}
                className="transition-transform duration-300 group-hover:rotate-[18deg]"
              />
              {t('cta.primary')}
            </Link>
            <Link href="/options?redirect=import" className={pillGhost}>
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

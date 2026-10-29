'use client'

import { useTranslations } from 'next-intl'
import CornerHandles from './CornerHandles'
import PlanColumn from './PlanColumn'

const SPONSOR_MAIL = 'mailto:contact.nexustimer@gmail.com?subject=Sponsor%20NexusTimer'

export default function OpenSourceSection() {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('free.title')}
        </h2>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">{t('free.subtitle')}</p>
      </div>

      <div className="relative mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 md:mt-20 md:border-x-0">
        <CornerHandles />
        <PlanColumn
          name={t('free.free-name')}
          sub={t('free.free-sub')}
          value="$0"
          unit={t('free.forever')}
          chips={[
            tPages('timer.title'),
            'Smart cube',
            t('footer.algorithms'),
            t('footer.multiplayer'),
            t('free.backups'),
            t('free.no-ads'),
            t('free.open-name')
          ]}
          action={{ href: '/app', label: t('hero.cta-primary') }}
        />
        <PlanColumn
          name={t('free.sponsor-name')}
          sub={t('free.sponsor-sub')}
          value={t('free.sponsor-value')}
          chips={[t('free.chip-badge'), t('free.chip-servers'), t('free.chip-features')]}
          action={{ href: SPONSOR_MAIL, label: t('free.sponsor-cta') }}
        />
      </div>
    </section>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import CornerHandles from './CornerHandles'
import FeatureCard from './FeatureCard'
import CompareVisual from './CompareVisual'
import SmartCubeVisual from './SmartCubeVisual'
import ProfileVisual from './ProfileVisual'
import AlgorithmsVisual from './AlgorithmsVisual'
import StatsVisual from './StatsVisual'
import OfflineVisual from './OfflineVisual'

export default function FeatureGrid() {
  const t = useTranslations('LandingPage.bento')

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('title')}
        </h2>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">{t('subtitle')}</p>
      </div>

      <div className="relative mt-14 grid gap-px border border-border bg-border md:mt-20 md:border-x-0 md:grid-cols-3">
        <CornerHandles />
        <FeatureCard
          title={t('stats-benefit')}
          desc={t('stats-story')}
          visual={<StatsVisual />}
          className="md:col-span-2"
        />
        <FeatureCard title={t('smart-benefit')} desc={t('smart-story')} visual={<SmartCubeVisual />} highlight />
        <FeatureCard title={t('algs-benefit')} desc={t('algs-story')} visual={<AlgorithmsVisual />} />
        <FeatureCard title={t('profile-benefit')} desc={t('profile-story')} visual={<ProfileVisual />} />
        <FeatureCard title={t('compare-benefit')} desc={t('compare-story')} visual={<CompareVisual />} />
        <FeatureCard
          title={t('offline-benefit')}
          desc={t('offline-story')}
          visual={<OfflineVisual />}
          wide
          className="md:col-span-3"
        />
      </div>
    </section>
  )
}

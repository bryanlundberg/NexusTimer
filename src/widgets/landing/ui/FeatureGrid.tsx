'use client'

import { useTranslations } from 'next-intl'
import { ArrowLeftRight, Bluetooth, BookOpen, LineChart, User } from 'lucide-react'
import CornerHandles from './CornerHandles'
import FeatureCard from './FeatureCard'
import CompareVisual from './CompareVisual'
import SmartCubeVisual from './SmartCubeVisual'
import ProfileVisual from './ProfileVisual'
import AlgorithmsVisual from './AlgorithmsVisual'
import StatsVisual from './StatsVisual'

export default function FeatureGrid() {
  const t = useTranslations('LandingPage.bento')

  return (
    <section className="px-4 pt-32 md:px-6 md:pt-44">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('title')}
        </h2>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">{t('subtitle')}</p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-px border border-border bg-border md:mt-20 md:grid-cols-3">
        <CornerHandles />
        <FeatureCard
          icon={ArrowLeftRight}
          title={t('compare-title')}
          desc={t('compare-desc')}
          visual={<CompareVisual />}
          className="md:col-span-2"
        />
        <FeatureCard
          icon={Bluetooth}
          title={t('smart-title')}
          desc={t('smart-desc')}
          visual={<SmartCubeVisual />}
          highlight
        />
        <FeatureCard icon={User} title={t('profile-title')} desc={t('profile-desc')} visual={<ProfileVisual />} />
        <FeatureCard icon={BookOpen} title={t('algs-title')} desc={t('algs-desc')} visual={<AlgorithmsVisual />} />
        <FeatureCard icon={LineChart} title={t('stats-title')} desc={t('stats-desc')} visual={<StatsVisual />} />
      </div>
    </section>
  )
}

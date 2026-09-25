'use client'

import { useTranslations } from 'next-intl'
import { Bluetooth, User, LineChart, ArrowLeftRight, BookOpen } from 'lucide-react'
import { CubeGridTexture } from '@/shared/ui/cube-grid-texture/CubeGridTexture'
import { Reveal } from '@/shared/ui/reveal/Reveal'
import BentoCard from './BentoCard'
import CompareVisual from './CompareVisual'
import SmartCubeVisual from './SmartCubeVisual'
import ProfileVisual from './ProfileVisual'
import AlgorithmsVisual from './AlgorithmsVisual'
import StatsVisual from './StatsVisual'

export default function FeatureBento() {
  const t = useTranslations('LandingPage.bento')

  return (
    <section className="lp-cv relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-gray-900"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)'
        }}
      >
        <CubeGridTexture opacity={0.028} />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-balance text-3xl font-bold tracking-[-0.02em] text-gray-900 md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-gray-600 md:text-base text-pretty">{t('subtitle')}</p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-6">
          <BentoCard
            icon={ArrowLeftRight}
            accent="var(--cube-red)"
            title={t('compare-title')}
            desc={t('compare-desc')}
            visual={<CompareVisual />}
            className="md:col-span-4"
          />
          <BentoCard
            icon={Bluetooth}
            accent="var(--cube-blue)"
            title={t('smart-title')}
            desc={t('smart-desc')}
            visual={<SmartCubeVisual />}
            className="md:col-span-2"
            delay={0.08}
          />
          <BentoCard
            icon={User}
            accent="var(--cube-orange)"
            title={t('profile-title')}
            desc={t('profile-desc')}
            visual={<ProfileVisual />}
            className="md:col-span-2"
            delay={0.05}
          />
          <BentoCard
            icon={BookOpen}
            accent="var(--cube-blue)"
            title={t('algs-title')}
            desc={t('algs-desc')}
            visual={<AlgorithmsVisual />}
            className="md:col-span-2"
            delay={0.1}
          />
          <BentoCard
            icon={LineChart}
            accent="var(--cube-green)"
            title={t('stats-title')}
            desc={t('stats-desc')}
            visual={<StatsVisual />}
            className="md:col-span-2"
            delay={0.15}
          />
        </div>
      </div>
    </section>
  )
}

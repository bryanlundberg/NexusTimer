'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { SolveTimerAnimation } from './SolveTimerAnimation'

export function LandingHero() {
  const t = useTranslations('LandingPage')

  return (
    <section className="relative min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center mt-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs text-gray-600 mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t('hero.badge')}
        </div>

        <div className="mb-8">
          <SolveTimerAnimation />
        </div>

        <div className="mb-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            {t('hero.title-before')}{' '}
            <span className="underline decoration-gray-300 underline-offset-4 decoration-2">
              {t('hero.title-highlight')}
            </span>
          </h1>
        </div>

        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4">
          {t('hero.subtitle')}
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10">
          <span>{t('hero.built-for')}</span>
          <RotatingText
            text={[
              t('hero.rotating.0'),
              t('hero.rotating.1'),
              t('hero.rotating.2'),
              t('hero.rotating.3'),
              t('hero.rotating.4'),
              t('hero.rotating.5'),
              t('hero.rotating.6'),
              t('hero.rotating.7')
            ]}
            duration={2000}
            className="text-gray-900 font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/app"
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 text-white font-semibold px-8 py-4 text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            <Image
              src="/landing/cube.gif"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="transition-transform group-hover:rotate-12"
            />
            {t('hero.cta-primary')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/options?redirect=import"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            {t('hero.cta-secondary')}
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-xs text-gray-400">
          <div className="flex -space-x-2">
            {[1, 2, 7].map((num) => (
              <Image
                key={num}
                className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-lg"
                src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                alt="Community member"
                width={28}
                height={28}
              />
            ))}
          </div>
          <span>{t('hero.social-proof')}</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300">
        <span className="text-[10px] uppercase tracking-[0.25em]">{t('hero.scroll')}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  )
}

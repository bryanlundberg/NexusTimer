'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { Reveal } from '@/shared/ui/reveal/Reveal'

export default function CrossPlatformZoom() {
  const t = useTranslations('LandingPage')

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center px-6">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900 mb-5">
            {t('cross-platform.title')}
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">{t('cross-platform.subtitle')}</p>
        </div>

        <div className="relative mx-auto w-full max-w-4xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-gray-900/10 shadow-2xl shadow-black/10 ring-1 ring-gray-900/5">
              <div className="bg-neutral-900 h-8 flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-red)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-yellow)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-green)]" />
                </div>
                <div className="mx-auto rounded-md bg-neutral-100 px-16 py-0.5 text-[10px] text-gray-500">
                  nexustimer.com
                </div>
              </div>
              <Image
                src="/landing/desk1.webp"
                alt="NexusTimer desktop view"
                width={1200}
                height={750}
                className="w-full"
              />
            </div>
          </Reveal>

          <div className="absolute -right-2 md:-right-6 -bottom-6 md:-bottom-10 z-20 w-24 md:w-40 drop-shadow-2xl">
            <Image
              src="/landing/cellphone2.webp"
              alt="NexusTimer mobile view"
              width={300}
              height={600}
              className="w-full"
            />
          </div>
        </div>

        <Reveal delay={0.15} className="mt-16 md:mt-20 flex flex-col items-center gap-3 px-6 text-center">
          <p className="text-sm text-gray-500">{t('cross-platform.android-note')}</p>
          <Link
            href="https://play.google.com/store/apps/details?id=com.nexustimer"
            target="_blank"
            rel="noreferrer"
            aria-label={t('cross-platform.google-play')}
            className="inline-flex rounded-lg transition-transform duration-300 hover:scale-[1.04]"
          >
            <Image
              src="/landing/gp.avif"
              alt={t('cross-platform.google-play')}
              width={186}
              height={55}
              className="h-[52px] w-auto rounded-lg shadow-lg shadow-black/10"
              unoptimized
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

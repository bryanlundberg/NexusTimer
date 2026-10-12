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

        <Reveal className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-[14px] bg-neutral-950 p-1.5 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.45)] ring-1 ring-gray-900/20 md:rounded-[22px] md:p-2.5">
            <div className="overflow-hidden rounded-[9px] ring-1 ring-white/10 md:rounded-[14px]">
              <Image
                src="/landing/desk2.webp"
                alt="NexusTimer desktop view"
                width={2558}
                height={1331}
                sizes="(min-width: 1024px) 976px, 100vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </Reveal>

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

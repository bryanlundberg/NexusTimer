'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Bluetooth, BookOpen, LineChart } from 'lucide-react'
import { Link } from '@/shared/config/i18n/navigation'
import CornerHandles from './CornerHandles'

export default function PlatformSection() {
  const t = useTranslations('LandingPage')

  const features = [
    { icon: Bluetooth, title: t('bento.smart-title'), desc: t('bento.smart-desc') },
    { icon: BookOpen, title: t('bento.algs-title'), desc: t('bento.algs-desc') },
    { icon: LineChart, title: t('bento.stats-title'), desc: t('bento.stats-desc') }
  ]

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('cross-platform.title')}
        </h2>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">{t('cross-platform.subtitle')}</p>
      </div>

      <div className="relative mt-14 md:mt-20 md:px-10">
        <div className="overflow-hidden rounded-[12px] border border-border [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
          <Image
            src="/landing/desk2.webp"
            alt="NexusTimer desktop view"
            width={2558}
            height={1331}
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="block h-auto w-full"
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:absolute lg:right-4 lg:top-[14%] lg:mt-0 lg:w-72 lg:flex-col lg:items-start lg:gap-3 lg:border lg:border-primary lg:bg-background/95 lg:p-5 lg:backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">{t('cross-platform.android-note')}</p>
          <Link
            href="https://play.google.com/store/apps/details?id=com.nexustimer"
            target="_blank"
            rel="noreferrer"
            aria-label={t('cross-platform.google-play')}
            className="inline-flex"
          >
            <Image
              src="/landing/gp.avif"
              alt={t('cross-platform.google-play')}
              width={186}
              height={55}
              className="h-11 w-auto"
              unoptimized
            />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-10 grid gap-px border border-border bg-border md:mt-0 md:border-x-0 md:grid-cols-3">
        <CornerHandles />
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-background p-6 md:p-8">
            <Icon className="size-5 text-foreground" aria-hidden />
            <h3 className="mt-4 text-base font-medium text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

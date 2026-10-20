'use client'

import type { ReactNode } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import FooterSlab from './FooterSlab'

/**
 * The close of the page. The CTA stays on the same light ground as everything
 * above it, so the reader never leaves the page's daylight to be asked; only
 * the footer goes dark, as a black slab that bookends the hero block and reads
 * as chrome rather than as one more section.
 */
export default function LandingOutro({ children }: { children: ReactNode }) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()

  return (
    <section className="relative">
      <div className="px-2 sm:px-3">
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32"
        >
          <h2 className="font-display text-balance text-4xl font-bold tracking-[-0.02em] text-foreground md:text-5xl lg:text-6xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
            {t('cta.subtitle')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/app" className={cn(buttonVariants({ size: 'xl' }), 'group')}>
              <Image
                src="/landing/cube.gif"
                alt=""
                width={22}
                height={22}
                unoptimized
                style={{ width: 22, height: 22 }}
                className="transition-transform duration-300 group-hover:rotate-[18deg]"
              />
              {t('cta.primary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/options?redirect=import" className={buttonVariants({ variant: 'outline', size: 'xl' })}>
              {t('cta.secondary')}
            </Link>
          </div>

          <div className="mt-10 text-xs text-muted-foreground">
            <Link href="/people" className="transition-colors hover:text-foreground hover:underline">
              {t('hero.social-proof')}
            </Link>
          </div>
        </m.div>
      </div>

      <FooterSlab>{children}</FooterSlab>
    </section>
  )
}

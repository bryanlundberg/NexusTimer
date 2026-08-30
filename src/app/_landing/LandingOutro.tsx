'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { STRIP } from './LandingHero'

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
      <div className="relative overflow-hidden px-2 sm:px-3">
        {/* A wash under the CTA so the light ground has a centre of gravity. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(58% 52% at 50% 42%, var(--lp-bg-deep) 0%, transparent 72%)' }}
        />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32"
        >
          <h2 className="font-display text-balance text-4xl font-bold tracking-[-0.02em] text-gray-900 md:text-5xl lg:text-6xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-base text-gray-600 md:text-lg">{t('cta.subtitle')}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden notch-bl-tr [--nblt:12px] bg-gray-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-700"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <Image
                src="/landing/cube.gif"
                alt=""
                width={22}
                height={22}
                unoptimized
                style={{ width: 22, height: 22 }}
                className="relative transition-transform duration-300 group-hover:rotate-[18deg]"
              />
              <span className="relative">{t('cta.primary')}</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/options?redirect=import"
              className="notch-tl-br inline-flex items-center justify-center border border-gray-900/15 bg-white/60 px-7 py-4 text-sm font-medium text-gray-700 transition-all duration-300 [--ntlbr:12px] hover:border-gray-900/30 hover:bg-white hover:text-gray-900"
            >
              {t('cta.secondary')}
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 7].map((num) => (
                <Image
                  key={num}
                  className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-sm"
                  src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                  alt="Community member"
                  width={28}
                  height={28}
                  loading="lazy"
                />
              ))}
            </div>
            <Link href="/people" className="transition-colors hover:text-gray-900 hover:underline">
              {t('hero.social-proof')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* The dark slab. Same block shape, gutter and colour-strip as the hero,
          so the page opens and closes on the same object. */}
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <div className="relative overflow-hidden rounded-[28px] bg-[var(--lp-hero-dark)] ring-1 ring-white/5">
          <div aria-hidden className="absolute inset-x-0 top-0 flex h-[3px]">
            {STRIP.map((c) => (
              <span key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

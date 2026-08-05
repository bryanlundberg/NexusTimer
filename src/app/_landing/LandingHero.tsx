'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { Nexi } from '@/shared/ui/nexi'

const STRIP = [
  'var(--cube-yellow)',
  'var(--cube-red)',
  'var(--cube-orange)',
  'var(--cube-blue)',
  'var(--cube-green)',
  'var(--primary)'
]

export function LandingHero({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // The hero drifts up and fades as the next section arrives.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainerRef,
    offset: ['start start', 'end start']
  })
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -110])
  const opacityRaw = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const y = reduce ? 0 : yRaw
  const opacity = reduce ? 1 : opacityRaw

  return (
    <section ref={sectionRef} className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[var(--lp-hero-dark)] px-6 ring-1 ring-white/5">
        <div aria-hidden className="absolute inset-x-0 top-0 flex h-[3px]">
          {STRIP.map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 55% at 50% 8%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)'
          }}
        />

        <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-3xl py-24 text-center">
          <h1
            className="lp-rise font-display text-balance text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-6xl"
            style={{ animationDelay: '0.12s' }}
          >
            {t('hero.title-before')}{' '}
            <span className="relative inline-block whitespace-nowrap text-primary">
              {t('hero.title-highlight')}
              <span
                aria-hidden
                className="lp-underline absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/60"
              />
            </span>
          </h1>

          <p
            className="lp-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-gray-400 md:text-lg"
            style={{ animationDelay: '0.19s' }}
          >
            {t('hero.subtitle')}
          </p>

          <div
            className="lp-rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.26s' }}
          >
            <Link
              href="/app"
              className="group notch-bl-tr inline-flex items-center justify-center gap-2.5 bg-primary px-8 py-4 text-sm font-semibold text-white transition-all duration-300 [--nblt:12px] hover:brightness-110"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <Nexi
                  state="hello"
                  size={24}
                  className="origin-center -translate-x-1 scale-50 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
                />
              </span>
              {t('hero.cta-primary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/algorithms"
              className="notch-tl-br inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-4 text-sm font-medium text-gray-200 transition-colors duration-300 [--ntlbr:12px] hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              {t('hero.cta-secondary')}
            </Link>
          </div>

          <div
            className="lp-rise mt-10 flex items-center justify-center gap-3 text-xs text-gray-400"
            style={{ animationDelay: '0.33s' }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 7].map((num) => (
                <Image
                  key={num}
                  className="inline-block h-7 w-7 rounded-full border-2 border-[var(--lp-hero-dark)]"
                  src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                  alt="Community member"
                  width={28}
                  height={28}
                  loading="lazy"
                />
              ))}
            </div>
            <Link href="/people" className="transition-colors hover:text-white hover:underline">
              {t('hero.social-proof')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.2, duration: 0.6 }}
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">{t('hero.scroll')}</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}

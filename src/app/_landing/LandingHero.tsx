'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'

export function LandingHero({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: the hero content drifts up and fades as the next section arrives.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainerRef,
    offset: ['start start', 'end start']
  })
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacityRaw = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const y = reduce ? 0 : yRaw
  const opacity = reduce ? 1 : opacityRaw

  return (
    <section ref={sectionRef} className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center overflow-hidden rounded-[28px] px-6 bg-[var(--lp-hero-dark)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div style={reduce ? undefined : { y: bgYRaw }} className="absolute -inset-[8%]">
            <Image src="/landing/4.avif" alt="" fill priority sizes="100vw" className="object-cover opacity-[0.12]" />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, var(--lp-hero-dark) 0%, transparent 30%, transparent 70%, var(--lp-hero-dark) 100%)'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, var(--lp-hero-dark) 0%, transparent 18%, transparent 82%, var(--lp-hero-dark) 100%)'
            }}
          />
        </div>

        {/* Ambient brand spotlight, very faint, anchored behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[520px] w-[min(820px,95vw)] -translate-y-1/4 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, #000 0%, rgba(0,0,0,0.6) 40%, transparent 72%)',
            opacity: 0.9
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 grid h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 grid-cols-3 grid-rows-3 gap-2 rotate-12 opacity-[0.16] sm:h-[200px] sm:w-[200px]"
        >
          {[
            'var(--cube-white)',
            'var(--cube-red)',
            'var(--cube-blue)',
            'var(--cube-green)',
            'var(--cube-yellow)',
            'var(--cube-orange)',
            'var(--cube-blue)',
            'var(--cube-white)',
            'var(--cube-green)'
          ].map((c, i) => (
            <span key={i} className="rounded-[5px]" style={{ backgroundColor: c }} />
          ))}
        </div>

        <motion.div style={{ y, opacity }} className="relative max-w-5xl mx-auto text-center mt-5">
          <h1
            className="lp-rise font-display text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-white mb-4"
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
            className="lp-rise text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4 text-pretty"
            style={{ animationDelay: '0.19s' }}
          >
            {t('hero.subtitle')}
          </p>

          <div
            className="lp-rise flex items-center justify-center gap-2 text-sm text-gray-400 mb-10"
            style={{ animationDelay: '0.26s' }}
          >
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
              className="text-white font-semibold"
            />
          </div>

          <div className="lp-rise flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.33s' }}>
            <Link
              href="/app"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary text-white font-semibold px-8 py-4 text-sm transition-all duration-300"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <Image
                src="/landing/cube.gif"
                alt=""
                width={24}
                height={24}
                unoptimized
                className="relative transition-transform duration-300 group-hover:rotate-[18deg]"
              />
              <span className="relative">{t('hero.cta-primary')}</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/options?redirect=import"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-medium text-gray-200 backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <span className="relative">{t('hero.cta-secondary')}</span>
            </Link>
          </div>

          <div
            className="lp-rise mt-12 flex items-center justify-center gap-4 text-xs text-gray-400"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 7].map((num) => (
                <Image
                  key={num}
                  className="inline-block h-7 w-7 rounded-full border-2 border-[var(--lp-hero-dark)] shadow-lg"
                  src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                  alt="Community member"
                  width={28}
                  height={28}
                  loading="lazy"
                />
              ))}
            </div>
            <span>{t('hero.social-proof')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">{t('hero.scroll')}</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react'
import { useRef } from 'react'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { SolveTimerAnimation } from './SolveTimerAnimation'

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
  const y = reduce ? 0 : yRaw
  const opacity = reduce ? 1 : opacityRaw

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 }
    }
  }
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center px-6"
    >
      {/* Ambient brand spotlight, very faint, anchored behind the timer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[420px] w-[min(680px,90vw)] -translate-y-1/4 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, var(--primary) 0%, transparent 65%)', opacity: 0.06 }}
      />

      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto text-center mt-5"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-1.5 text-xs text-gray-600 mb-10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {t('hero.badge')}
        </motion.div>

        <motion.div variants={item} className="mb-8">
          <SolveTimerAnimation />
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4"
        >
          {t('hero.title-before')}{' '}
          <span className="relative inline-block whitespace-nowrap text-primary">
            {t('hero.title-highlight')}
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-primary/60"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4 text-pretty"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div variants={item} className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10">
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
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/app"
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 text-white font-semibold px-8 py-4 text-sm transition-all duration-300 hover:bg-gray-800 hover:scale-[1.03] hover:shadow-[0_8px_30px_-8px_var(--primary)]"
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
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-4 text-sm text-gray-700 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-gray-900"
          >
            {t('hero.cta-secondary')}
          </Link>
        </motion.div>

        <motion.div variants={item} className="mt-12 flex items-center justify-center gap-4 text-xs text-gray-400">
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
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">{t('hero.scroll')}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </section>
  )
}

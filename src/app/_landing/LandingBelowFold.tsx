'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { ChevronDown, Quote } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence
} from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import StickerSteps from './StickerSteps'

/**
 * A real photo dropped behind a section as toned texture. Heavy scrim keeps the
 * foreground text well above AA contrast; a gentle parallax echoes the hall shot.
 */
function PhotoBackdrop({
  src,
  scrollContainer,
  parallax = true,
  overlay = 72,
  objectPosition = 'center',
  fade = 18,
  vignette = false
}: {
  src: string
  scrollContainer: React.RefObject<HTMLDivElement | null>
  parallax?: boolean
  overlay?: number
  objectPosition?: string
  fade?: number
  vignette?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  const mid = `color-mix(in oklch, var(--lp-bg) ${overlay}%, transparent)`
  // vignette: photo only surfaces through a soft centre ellipse, fading to solid
  // lp-bg on all four edges so it never touches the screen border.
  // default: solid lp-bg holds at top/bottom so it never seams vertically.
  const bg = vignette
    ? `radial-gradient(ellipse 76% 64% at 50% 50%, transparent 26%, var(--lp-bg) 84%), linear-gradient(0deg, ${mid}, ${mid})`
    : `linear-gradient(to bottom, var(--lp-bg) 0%, var(--lp-bg) ${fade}%, ${mid} ${fade + 22}%, ${mid} ${
        78 - fade
      }%, var(--lp-bg) ${100 - fade}%, var(--lp-bg) 100%)`

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div style={parallax && !reduce ? { y } : undefined} className="absolute -inset-[10%]">
        <Image src={src} alt="" fill sizes="100vw" className="object-cover opacity-90" style={{ objectPosition }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: bg }} />
    </div>
  )
}

/**
 * A horizontal photo pinned as a band across the TOP of a section: it covers the
 * heading and the first sliver of content, then dissolves into lp-bg before the
 * body begins. Sides fade too so it never reaches the screen edge.
 */
function PhotoBand({
  src,
  scrollContainer,
  height = '64vh'
}: {
  src: string
  scrollContainer: React.RefObject<HTMLDivElement | null>
  height?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
      style={{ height }}
    >
      <motion.div style={reduce ? undefined : { y }} className="absolute -inset-x-[6%] -top-[26%] bottom-0">
        <Image src={src} alt="" fill sizes="100vw" className="object-cover opacity-10" />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklch, var(--lp-bg) 58%, transparent) 0%, color-mix(in oklch, var(--lp-bg) 60%, transparent) 42%, var(--lp-bg) 100%)'
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, var(--lp-bg) 0%, transparent 16%, transparent 84%, var(--lp-bg) 100%)'
        }}
      />
    </div>
  )
}

function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return { count, ref }
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
      layout
    >
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left">
        <span className="text-sm font-semibold text-gray-100 pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function useShowcaseCards() {
  const t = useTranslations('LandingPage')
  return [
    {
      title: t('showcase.public-profiles-title'),
      description: t('showcase.public-profiles-desc'),
      imageSrc: '/landing/Screenshot_44.avif'
    },
    {
      title: t('showcase.stats-per-cube-title'),
      description: t('showcase.stats-per-cube-desc'),
      imageSrc: '/landing/Screenshot_40.avif'
    },
    {
      title: t('showcase.deep-analytics-title'),
      description: t('showcase.deep-analytics-desc'),
      imageSrc: '/landing/Screenshot_41.avif'
    },
    {
      title: 'Algorithm Trainer',
      description: 'Measure execution time per algorithm.',
      imageSrc: '/landing/Screenshot_14.avif'
    },
    {
      title: t('showcase.real-time-battles-title'),
      description: t('showcase.real-time-battles-desc'),
      imageSrc: '/landing/Screenshot_38.avif'
    }
  ]
}

function ShowcaseHeader() {
  const t = useTranslations('LandingPage')
  return (
    <div className="mx-auto max-w-7xl px-6 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2.5 mb-4 text-sm font-medium text-primary"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {t('showcase.label')}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
      >
        {t('showcase.title')}
      </motion.h2>
    </div>
  )
}

function ShowcaseCard({
  card,
  index,
  total
}: {
  card: ReturnType<typeof useShowcaseCards>[number]
  index: number
  total: number
}) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 transition-colors duration-500 hover:border-primary/40">
      <Image
        src={card.imageSrc}
        alt={card.title}
        width={800}
        height={500}
        className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Index marker — earns its place: it's an ordered tour through the app */}
      <div className="absolute top-5 left-5 flex items-center gap-2 text-white/80">
        <span className="font-mono text-xs tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <span className="h-px w-6 bg-white/30" />
        <span className="font-mono text-xs tabular-nums text-white/50">{String(total).padStart(2, '0')}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-bold text-xl md:text-2xl text-white mb-2">{card.title}</h3>
        <p className="text-sm text-white/70 leading-relaxed max-w-md text-pretty">{card.description}</p>
      </div>
    </div>
  )
}

function HorizontalShowcase({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const cards = useShowcaseCards()
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const rowRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState(0)

  useEffect(() => {
    const measure = () => {
      const el = rowRef.current
      if (el) setMaxScroll(Math.max(0, el.scrollWidth - el.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })
  // Travel the exact measured overflow in px, so every card is revealed no
  // matter the card size or viewport width (a fixed % guesses wrong on wide screens).
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll])

  // Mobile: a horizontal sticky pin fights the native vertical scroll, so the
  // cards become a clean vertical reveal stack instead.
  if (isMobile) {
    return (
      <section className="relative py-20">
        <ShowcaseHeader />
        <div className="mx-auto max-w-xl px-6 flex flex-col gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[16/10]"
            >
              <ShowcaseCard card={card} index={index} total={cards.length} />
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative h-[255vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <ShowcaseHeader />

        <motion.div
          ref={rowRef}
          style={{ x }}
          className="flex gap-6 pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[90vw] md:w-[54vw] lg:w-[44vw] aspect-[16/10]"
            >
              <ShowcaseCard card={card} index={index} total={cards.length} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ParallaxBand({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <PhotoBackdrop src="/landing/5.avif" scrollContainer={scrollContainer} overlay={90} vignette />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: 17, suffix: '+', label: t('stats.wca-events'), accent: 'var(--cube-blue)' },
            { value: 10, suffix: '', label: t('stats.languages'), accent: 'var(--cube-green)' },
            { value: 100, suffix: '%', label: t('stats.free'), accent: 'var(--cube-orange)' },
            { value: 5, suffix: '★', label: t('stats.open-source'), accent: 'var(--cube-yellow)' }
          ].map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.1}
              accent={stat.accent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StickyTestimonials({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')
  const testimonials = [
    { text: t('testimonials.t0-text'), user: t('testimonials.t0-user'), avatar: 9, role: t('testimonials.t0-role') },
    { text: t('testimonials.t1-text'), user: t('testimonials.t1-user'), avatar: 5, role: t('testimonials.t1-role') },
    { text: t('testimonials.t2-text'), user: t('testimonials.t2-user'), avatar: 4, role: t('testimonials.t2-role') }
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })

  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, testimonials.length - 1])
  const [current, setCurrent] = useState(0)

  useMotionValueEvent(activeIndex, 'change', (latest) => {
    setCurrent(Math.round(latest))
  })

  return (
    <section ref={containerRef} style={{ height: `${testimonials.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-3xl w-full px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-10 text-center">
            {t('testimonials.label')}
          </p>

          <div className="relative min-h-[280px]">
            {testimonials.map((tm, index) => (
              <motion.div
                key={tm.user}
                initial={false}
                animate={{
                  opacity: current === index ? 1 : 0,
                  y: current === index ? 0 : 30,
                  filter: current === index ? 'blur(0px)' : 'blur(8px)'
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn('absolute inset-0 flex flex-col items-center text-center', index === 0 && 'relative')}
              >
                <Quote className="h-8 w-8 text-white/15 mb-6" />
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8 max-w-2xl">
                  {tm.text}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    className="h-10 w-10 rounded-full border-2 border-white/10"
                    src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${tm.avatar}.png`}
                    alt="User avatar"
                    width={40}
                    height={40}
                  />
                  <div className="text-left">
                    <span className="text-sm font-semibold text-white block">{tm.user}</span>
                    <span className="text-xs text-gray-500">{tm.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 justify-center mt-10">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 rounded-full transition-all duration-500',
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/15'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({
  value,
  suffix,
  label,
  delay,
  accent
}: {
  value: number
  suffix: string
  label: string
  delay: number
  accent: string
}) {
  const { count, ref } = useCounter(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <span ref={ref} className="text-4xl md:text-6xl font-black text-white tabular-nums tracking-tight">
        {count}
        <span style={{ color: accent }}>{suffix}</span>
      </span>
      <p className="text-xs text-gray-300 mt-3 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
  )
}

function CrossPlatformZoom({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })

  const deviceScale = useTransform(scrollYProgress, [0, 1], [0.86, 1.5])
  const deviceY = useTransform(scrollYProgress, [0, 1], [24, -12])
  const radius = useTransform(scrollYProgress, [0, 0.6], [14, 2])
  const chromeOpacity = useTransform(scrollYProgress, [0.15, 0.45], [1, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0])
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -56])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.2])
  const phoneOpacity = useTransform(scrollYProgress, [0.06, 0.34], [0, 1])
  const phoneX = useTransform(scrollYProgress, [0.06, 0.4], [70, 0])
  const phoneScale = useTransform(scrollYProgress, [0.1, 1], [0.9, 1.12])

  const header = (
    <div className="text-center px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{t('cross-platform.label')}</p>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">{t('cross-platform.title')}</h2>
      <p className="text-gray-400 text-base max-w-xl mx-auto">{t('cross-platform.subtitle')}</p>
    </div>
  )

  const browser = (
    <motion.div
      style={reduce ? undefined : { borderRadius: radius }}
      className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5"
    >
      <motion.div
        style={reduce ? undefined : { opacity: chromeOpacity }}
        className="bg-neutral-900 h-8 flex items-center px-4 gap-2 border-b border-white/5"
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-red)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-yellow)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-green)]" />
        </div>
        <div className="mx-auto rounded-md bg-neutral-100 px-16 py-0.5 text-[10px] text-gray-500">nexustimer.com</div>
      </motion.div>
      <Image src="/landing/desk2.avif" alt="NexusTimer desktop view" width={1200} height={750} className="w-full" />
    </motion.div>
  )

  if (reduce) {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">{header}</div>
          <div className="relative mx-auto w-full max-w-4xl px-6">
            {browser}
            <div className="absolute -right-4 md:right-8 -bottom-8 md:-bottom-12 w-32 md:w-48">
              <Image
                src="/landing/iphone13.avif"
                alt="NexusTimer mobile view"
                width={300}
                height={600}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-10 md:gap-14 overflow-hidden">
        <motion.div
          aria-hidden
          style={{
            opacity: glowOpacity,
            background: 'radial-gradient(circle, var(--cube-blue) 0%, transparent 65%)'
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        />

        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="relative z-20">
          {header}
        </motion.div>

        <motion.div style={{ scale: deviceScale, y: deviceY }} className="relative z-10 w-full max-w-4xl px-6">
          {browser}
        </motion.div>

        <motion.div
          style={{ opacity: phoneOpacity, x: phoneX, scale: phoneScale }}
          className="absolute right-[5%] bottom-[8%] z-20 w-24 md:w-40"
        >
          <Image
            src="/landing/iphone13.avif"
            alt="NexusTimer mobile view"
            width={300}
            height={600}
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default function LandingBelowFold({
  scrollContainerRef,
  featureTable
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  featureTable: ReactNode
}) {
  const t = useTranslations('LandingPage')

  return (
    <>
      <ParallaxBand scrollContainer={scrollContainerRef} />

      <HorizontalShowcase scrollContainer={scrollContainerRef} />

      <section className="relative py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8">{t('brands.label')}</p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--lp-bg)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--lp-bg)] to-transparent z-10 pointer-events-none" />
            <motion.div
              animate={{ x: [0, -800] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 whitespace-nowrap"
            >
              {[
                ...['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng'],
                ...['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng']
              ].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-gray-400"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <StickerSteps />

      <CrossPlatformZoom scrollContainer={scrollContainerRef} />

      <div className="relative overflow-hidden">
        <PhotoBand src="/landing/7.avif" scrollContainer={scrollContainerRef} height="70vh" />
        <div className="relative z-10">{featureTable}</div>
      </div>

      <StickyTestimonials scrollContainer={scrollContainerRef} />

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{t('faq.label')}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{t('faq.title')}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <FAQItem question={t('faq.q0')} answer={t('faq.a0')} />
            <FAQItem question={t('faq.q1')} answer={t('faq.a1')} />
            <FAQItem question={t('faq.q2')} answer={t('faq.a2')} />
            <FAQItem question={t('faq.q3')} answer={t('faq.a3')} />
            <FAQItem question={t('faq.q4')} answer={t('faq.a4')} />
            <FAQItem question={t('faq.q5')} answer={t('faq.a5')} />
          </motion.div>
        </div>
      </section>
    </>
  )
}

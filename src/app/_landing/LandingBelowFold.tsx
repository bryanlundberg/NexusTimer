'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { AudioWaveform, BarChart3, ChevronDown, DatabaseZap, Globe, Quote, Timer, Users } from 'lucide-react'
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
      imageSrc: '/landing/Screenshot_44.png'
    },
    {
      title: t('showcase.stats-per-cube-title'),
      description: t('showcase.stats-per-cube-desc'),
      imageSrc: '/landing/Screenshot_40.png'
    },
    {
      title: t('showcase.deep-analytics-title'),
      description: t('showcase.deep-analytics-desc'),
      imageSrc: '/landing/Screenshot_41.png'
    },
    {
      title: 'Algorithm Trainer',
      description: 'Measure execution time per algorithm.',
      imageSrc: '/landing/Screenshot_14.png'
    },
    {
      title: t('showcase.real-time-battles-title'),
      description: t('showcase.real-time-battles-desc'),
      imageSrc: '/landing/Screenshot_38.png'
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])

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
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <ShowcaseHeader />

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] aspect-[16/10]"
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
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start']
  })
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -150])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-5, 5])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [5, -5])

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden">
      <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute -left-20 top-1/4 opacity-20">
        <Image src="/categories/cube333.png" alt="" width={200} height={200} className="blur-[1px]" />
      </motion.div>
      <motion.div style={{ y: y2, rotate: rotate2 }} className="absolute -right-16 top-1/3 opacity-15">
        <Image src="/categories/pyramix.png" alt="" width={180} height={180} className="blur-[1px]" />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute left-1/4 bottom-10 opacity-10">
        <Image src="/categories/cube222.png" alt="" width={120} height={120} className="blur-[2px]" />
      </motion.div>

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

function ScrollRevealSection({
  children,
  scrollContainer,
  className
}: {
  children: React.ReactNode
  scrollContainer: React.RefObject<HTMLDivElement | null>
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [80, 0, 0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
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
      <p className="text-xs text-gray-500 mt-3 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
  )
}

function StepArtifact({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="inline-flex items-center gap-2 font-mono text-sm">
        <span className="font-bold tabular-nums text-white">1,204</span>
        <span className="text-xs text-gray-400">solves</span>
        <span className="text-[var(--cube-green)]">✓</span>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="inline-flex items-center gap-2.5 font-mono text-sm">
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-gray-300">333</span>
        <span className="font-bold tabular-nums text-white">8.42</span>
        <span className="hidden text-xs text-gray-500 sm:inline">{"R U R' U'"}</span>
      </div>
    )
  }
  if (step === 2) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
          <span className="text-gray-500">ao5 </span>
          <span className="font-bold tabular-nums text-white">8.91</span>
        </span>
        <span
          className="rounded-md px-2 py-1"
          style={{
            borderWidth: 1,
            borderColor: 'color-mix(in oklch, var(--cube-green) 34%, transparent)',
            backgroundColor: 'color-mix(in oklch, var(--cube-green) 12%, transparent)'
          }}
        >
          <span className="text-gray-400">PB </span>
          <span className="font-bold tabular-nums text-[var(--cube-green)]">6.71 ▲</span>
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-end gap-1" aria-hidden>
        {[14, 11, 12, 8, 6].map((h, i) => (
          <span
            key={i}
            style={{ height: h }}
            className={cn('w-1.5 rounded-sm', i === 4 ? 'bg-[var(--cube-green)]' : 'bg-white/20')}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-bold tabular-nums text-[var(--cube-green)]">−1.8s</span>
    </div>
  )
}

function CapabilityArtifact({ kind }: { kind: string }) {
  if (kind === 'analytics') {
    return (
      <div className="grid grid-cols-3 gap-2 font-mono">
        {[
          { k: 'ao5', v: '8.91' },
          { k: 'ao12', v: '9.34' },
          { k: 'PB', v: '6.71' }
        ].map((s) => (
          <div key={s.k} className="rounded-md border border-[var(--chip-bd)] bg-[var(--chip-bg)] px-2.5 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{s.k}</div>
            <div className="text-base font-bold tabular-nums text-[var(--ink)]">{s.v}</div>
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'multiplayer') {
    return (
      <div className="space-y-1.5 font-mono text-sm">
        <div className="flex items-center justify-between gap-4 rounded-md border-2 border-[var(--chip-bd)] bg-[var(--chip-bg)] px-2.5 py-1.5">
          <span className="text-xs font-semibold text-[var(--ink)]">you</span>
          <span className="font-bold tabular-nums text-[var(--ink)]">8.42</span>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-md px-2.5 py-1.5">
          <span className="text-xs text-[var(--muted)]">rival</span>
          <span className="font-bold tabular-nums text-[var(--muted)]">9.10</span>
        </div>
      </div>
    )
  }
  if (kind === 'profiles') {
    return (
      <div className="space-y-1.5 font-mono text-xs">
        {[
          ['333', '8.42'],
          ['222', '2.10'],
          ['pyra', '3.05']
        ].map(([ev, v]) => (
          <div key={ev} className="flex items-center justify-between gap-3">
            <span className="rounded border border-[var(--chip-bd)] bg-[var(--chip-bg)] px-1.5 py-0.5 text-[10px] text-[var(--ink)]">
              {ev}
            </span>
            <span className="font-bold tabular-nums text-[var(--ink)]">{v}</span>
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'algorithms') {
    return (
      <div className="flex items-center gap-3 font-mono">
        <span className="rounded-md border border-[var(--chip-bd)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-bold text-[var(--ink)]">
          OLL 21
        </span>
        <span className="truncate text-sm font-medium tabular-nums text-[var(--muted)]">{"R U2 R' U' R U' R'"}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-4 font-mono">
      <div>
        <div className="text-2xl font-bold tabular-nums text-[var(--ink)]">12,480</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">solves synced</div>
      </div>
      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--chip-bd)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
        ✓ up to date
      </span>
    </div>
  )
}

function HowItWorks() {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()

  const steps = [
    { title: t('how-it-works.step1-title'), desc: t('how-it-works.step1-desc') },
    { title: t('how-it-works.step2-title'), desc: t('how-it-works.step2-desc') },
    { title: t('how-it-works.step3-title'), desc: t('how-it-works.step3-desc') },
    { title: t('how-it-works.step4-title'), desc: t('how-it-works.step4-desc') }
  ]

  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-14"
        >
          <div className="inline-flex items-center gap-2.5 mb-4 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t('how-it-works.label')}
          </div>
          <h2 className="text-balance text-3xl md:text-5xl font-bold tracking-tight text-white">
            {t('how-it-works.title')}
          </h2>
        </motion.header>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3.5 md:px-7">
            <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cube-green)] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--cube-green)]" />
              </span>
              session log
            </div>
            <span className="font-mono text-xs text-gray-500">zero setup</span>
          </div>

          <ol>
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/5 px-5 py-5 transition-colors last:border-0 hover:bg-white/[0.02] md:gap-6 md:px-7"
              >
                <div className="pt-0.5 font-mono text-sm tabular-nums text-gray-600">{`0${i + 1}`}</div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="md:max-w-xs">
                    <h3 className="text-base font-semibold tracking-tight text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed text-pretty">{step.desc}</p>
                    {i === 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {['csTimer', 'Twisty Timer', 'CubeDesk'].map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-gray-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 md:pl-4">
                    <StepArtifact step={i} />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
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
      <Image src="/landing/desk2.png" alt="NexusTimer desktop view" width={1200} height={750} className="w-full" />
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
                src="/landing/iphone13.png"
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
          <Image src="/landing/iphone13.png" alt="NexusTimer mobile view" width={300} height={600} className="w-full" />
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

      <ScrollRevealSection scrollContainer={scrollContainerRef}>
        <section className="relative py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2.5 mb-4 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t('capabilities.label')}
              </div>
              <h2 className="text-balance text-3xl md:text-5xl font-bold tracking-tight text-white">
                {t('capabilities.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:auto-rows-[248px]">
              {[
                {
                  icon: Timer,
                  title: t('capabilities.timer-title'),
                  description: t('capabilities.timer-desc'),
                  span: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
                  featured: true,
                  tint: null,
                  kind: 'timer'
                },
                {
                  icon: BarChart3,
                  title: t('capabilities.analytics-title'),
                  description: t('capabilities.analytics-desc'),
                  span: 'lg:col-span-2',
                  featured: false,
                  tint: 'var(--cube-green)',
                  kind: 'analytics'
                },
                {
                  icon: Users,
                  title: t('capabilities.multiplayer-title'),
                  description: t('capabilities.multiplayer-desc'),
                  span: '',
                  featured: false,
                  tint: 'var(--cube-orange)',
                  kind: 'multiplayer'
                },
                {
                  icon: Globe,
                  title: t('capabilities.profiles-title'),
                  description: t('capabilities.profiles-desc'),
                  span: '',
                  featured: false,
                  tint: 'var(--cube-white)',
                  kind: 'profiles'
                },
                {
                  icon: AudioWaveform,
                  title: t('capabilities.algorithms-title'),
                  description: t('capabilities.algorithms-desc'),
                  span: 'lg:col-span-2',
                  featured: false,
                  tint: 'var(--cube-red)',
                  kind: 'algorithms'
                },
                {
                  icon: DatabaseZap,
                  title: t('capabilities.cloud-title'),
                  description: t('capabilities.cloud-desc'),
                  span: 'md:col-span-2 lg:col-span-2',
                  featured: false,
                  tint: 'var(--cube-yellow)',
                  kind: 'cloud'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  style={
                    (feature.featured
                      ? {
                          background: 'linear-gradient(150deg, oklch(0.62 0.2 262) 0%, oklch(0.44 0.18 264) 100%)',
                          borderColor: 'rgba(0,0,0,0.45)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 26px 60px -28px var(--cube-blue)',
                          '--ink': '#ffffff',
                          '--muted': 'rgba(255,255,255,0.72)',
                          '--chip-bg': 'rgba(255,255,255,0.16)',
                          '--chip-bd': 'rgba(255,255,255,0.24)'
                        }
                      : {
                          backgroundColor: feature.tint as string,
                          borderColor: 'rgba(0,0,0,0.45)',
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 18px 46px -28px ${feature.tint}`,
                          '--ink': '#15171e',
                          '--muted': 'rgba(18,20,28,0.66)',
                          '--chip-bg': 'rgba(0,0,0,0.12)',
                          '--chip-bd': 'rgba(0,0,0,0.22)'
                        }) as unknown as React.CSSProperties
                  }
                  className={cn(
                    'group relative overflow-hidden rounded-lg border-2 p-5 md:p-6 flex flex-col',
                    feature.span
                  )}
                >
                  {/* plastic-sticker sheen */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent"
                  />

                  {feature.featured ? (
                    <div className="relative z-10 flex h-full flex-col text-white">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-white/25 bg-white/15">
                        <feature.icon strokeWidth={1.75} className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">{feature.title}</h3>
                      <p className="max-w-sm text-sm leading-relaxed text-pretty text-white/80 md:text-base">
                        {feature.description}
                      </p>

                      {/* The anchor tile reads like a live timer: solve time + averages + scramble */}
                      <div className="mt-auto pt-8">
                        <div className="flex items-end gap-4">
                          <div className="font-mono text-5xl font-black leading-none tabular-nums text-white md:text-7xl">
                            8.42
                          </div>
                          <div className="flex flex-col gap-1.5 pb-1 font-mono">
                            <span className="rounded bg-white/15 px-2 py-0.5 text-[11px]">
                              <span className="text-white/55">ao5 </span>
                              <span className="font-bold tabular-nums text-white">8.91</span>
                            </span>
                            <span className="rounded bg-white/15 px-2 py-0.5 text-[11px]">
                              <span className="text-white/55">PB </span>
                              <span className="font-bold tabular-nums text-white">6.71</span>
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 truncate font-mono text-[11px] tracking-wide text-white/55 md:text-xs">
                          {"scramble  ·  R U R' U' F2 L' D B2 R2 U'"}
                        </p>
                      </div>
                    </div>
                  ) : feature.span.includes('col-span-2') ? (
                    <div
                      className="relative z-10 flex h-full items-center gap-5 md:gap-8"
                      style={{ color: 'var(--ink)' }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-2.5 flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--chip-bd)] bg-[var(--chip-bg)]">
                            <feature.icon strokeWidth={2} className="h-5 w-5 text-[var(--ink)]" />
                          </div>
                          <h3 className="text-base font-bold text-[var(--ink)]">{feature.title}</h3>
                        </div>
                        <p className="line-clamp-2 max-w-sm text-sm font-medium leading-relaxed text-pretty text-[var(--muted)]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <CapabilityArtifact kind={feature.kind} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 flex h-full flex-col" style={{ color: 'var(--ink)' }}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--chip-bd)] bg-[var(--chip-bg)]">
                          <feature.icon strokeWidth={2} className="h-5 w-5 text-[var(--ink)]" />
                        </div>
                        <h3 className="text-base font-bold text-[var(--ink)]">{feature.title}</h3>
                      </div>
                      <p className="line-clamp-2 text-sm font-medium leading-relaxed text-pretty text-[var(--muted)]">
                        {feature.description}
                      </p>
                      <div className="mt-auto pt-5">
                        <CapabilityArtifact kind={feature.kind} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <HowItWorks />

      <CrossPlatformZoom scrollContainer={scrollContainerRef} />

      {featureTable}

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

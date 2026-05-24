'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  AudioWaveform,
  BarChart3,
  ChevronDown,
  DatabaseZap,
  Globe,
  Quote,
  Timer,
  Users,
  Zap
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from 'motion/react'
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
      className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:bg-gray-50 transition-colors"
      layout
    >
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left">
        <span className="text-sm font-semibold text-gray-800 pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
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
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function HorizontalShowcase({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('LandingPage')
  const containerRef = useRef<HTMLDivElement>(null)
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
  const xMobile = useTransform(scrollYProgress, [0, 1], ['0%', '-72%'])
  const xDesktop = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])
  const x = isMobile ? xMobile : xDesktop

  const cards = [
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

  if (isMobile) return null

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4"
          >
            {t('showcase.label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
          >
            {t('showcase.title')}
          </motion.h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 transition-all duration-700 hover:border-gray-300 hover:shadow-2xl hover:shadow-black/5">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  width={800}
                  height={500}
                  className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-bold text-xl md:text-2xl text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed max-w-md">{card.description}</p>
                </div>
              </div>
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
            { value: 17, suffix: '+', label: t('stats.wca-events') },
            { value: 10, suffix: '', label: t('stats.languages') },
            { value: 100, suffix: '%', label: t('stats.free') },
            { value: 5, suffix: '★', label: t('stats.open-source') }
          ].map((stat, i) => (
            <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={i * 0.1} />
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
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-10 text-center">
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
                <Quote className="h-8 w-8 text-gray-200 mb-6" />
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed mb-8 max-w-2xl">
                  {tm.text}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    className="h-10 w-10 rounded-full border-2 border-gray-100"
                    src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${tm.avatar}.png`}
                    alt="User avatar"
                    width={40}
                    height={40}
                  />
                  <div className="text-left">
                    <span className="text-sm font-semibold text-gray-900 block">{tm.user}</span>
                    <span className="text-xs text-gray-400">{tm.role}</span>
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
                  i === current ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'
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

function StatItem({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCounter(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <span ref={ref} className="text-4xl md:text-6xl font-black text-gray-900 tabular-nums tracking-tight">
        {count}
        <span className="text-gray-400">{suffix}</span>
      </span>
      <p className="text-xs text-gray-400 mt-3 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
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
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8">{t('brands.label')}</p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
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
                  className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-6 py-2.5 text-sm font-medium text-gray-500"
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
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{t('capabilities.label')}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{t('capabilities.title')}</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Timer, title: t('capabilities.timer-title'), description: t('capabilities.timer-desc') },
                {
                  icon: BarChart3,
                  title: t('capabilities.analytics-title'),
                  description: t('capabilities.analytics-desc')
                },
                {
                  icon: Users,
                  title: t('capabilities.multiplayer-title'),
                  description: t('capabilities.multiplayer-desc')
                },
                { icon: Globe, title: t('capabilities.profiles-title'), description: t('capabilities.profiles-desc') },
                {
                  icon: AudioWaveform,
                  title: t('capabilities.algorithms-title'),
                  description: t('capabilities.algorithms-desc')
                },
                { icon: DatabaseZap, title: t('capabilities.cloud-title'), description: t('capabilities.cloud-desc') }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                >
                  <div className="relative z-10">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 w-fit mb-5 group-hover:bg-gray-100 transition-colors duration-300">
                      <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection scrollContainer={scrollContainerRef}>
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{t('how-it-works.label')}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{t('how-it-works.title')}</h2>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
                {[
                  { number: 1, title: t('how-it-works.step1-title'), desc: t('how-it-works.step1-desc'), icon: Zap },
                  { number: 2, title: t('how-it-works.step2-title'), desc: t('how-it-works.step2-desc'), icon: Timer },
                  {
                    number: 3,
                    title: t('how-it-works.step3-title'),
                    desc: t('how-it-works.step3-desc'),
                    icon: BarChart3
                  },
                  {
                    number: 4,
                    title: t('how-it-works.step4-title'),
                    desc: t('how-it-works.step4-desc'),
                    icon: ArrowRight
                  }
                ].map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative flex flex-col items-center text-center group"
                  >
                    <div className="relative z-10 h-20 w-20 rounded-2xl border border-gray-200 bg-white flex items-center justify-center mb-6 shadow-sm group-hover:border-gray-300 group-hover:shadow-md transition-all duration-500">
                      <step.icon className="h-7 w-7 text-gray-900" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                      {t('how-it-works.step')} {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      <ScrollRevealSection scrollContainer={scrollContainerRef}>
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{t('cross-platform.label')}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5">
                {t('cross-platform.title')}
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">{t('cross-platform.subtitle')}</p>
            </motion.div>

            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl"
              >
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50">
                  <div className="bg-neutral-800 h-8 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-200" />
                    </div>
                    <div className="mx-auto rounded-md bg-neutral-100 px-16 py-0.5 text-[10px] text-gray-400">
                      nexustimer.com
                    </div>
                  </div>
                  <Image
                    src="/landing/desk2.png"
                    alt="NexusTimer desktop view"
                    width={1200}
                    height={750}
                    className="w-full"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -right-4 md:right-8 -bottom-8 md:-bottom-12 w-32 md:w-48"
                >
                  <div className="bg-transparent">
                    <Image
                      src="/landing/iphone13.png"
                      alt="NexusTimer mobile view"
                      width={300}
                      height={600}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

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
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{t('faq.label')}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{t('faq.title')}</h2>
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

      <ScrollRevealSection scrollContainer={scrollContainerRef}>
        <section className="relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl px-6"
          >
            <div className="relative rounded-[2rem] border border-gray-200 overflow-hidden">
              <div className="relative bg-white rounded-[2rem] p-12 md:p-20 text-center">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <Image
                    src="/bg.webp"
                    alt=""
                    width={400}
                    height={400}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 mb-8"
                  >
                    <Image src="/landing/cube.gif" alt="" width={40} height={40} unoptimized />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5"
                  >
                    {t('cta.title')}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-gray-500 text-base md:text-lg mb-10 max-w-md mx-auto"
                  >
                    {t('cta.subtitle')}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                  >
                    <Link
                      href="/app"
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 text-white font-semibold px-8 py-4 text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                    >
                      {t('cta.primary')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/options?redirect=import"
                      className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                      {t('cta.secondary')}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </ScrollRevealSection>
    </>
  )
}

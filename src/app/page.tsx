'use client'

import Link from 'next/link'
import {
  ArrowRight,
  AudioWaveform,
  BarChart3,
  ChevronDown,
  DatabaseZap,
  Globe,
  StarIcon,
  Timer,
  Users,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Animated counter hook ───
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

// ─── Solve timer simulation ───
function SolveTimerAnimation() {
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'inspecting' | 'solving' | 'done'>('idle')

  useEffect(() => {
    const cycle = () => {
      setPhase('inspecting')
      setTime(0)

      setTimeout(() => {
        setPhase('solving')
        const solveTarget = 7.5 + Math.random() * 5
        const startTime = Date.now()

        const interval = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed >= solveTarget) {
            setTime(solveTarget)
            setPhase('done')
            clearInterval(interval)
            setTimeout(cycle, 3000)
          } else {
            setTime(elapsed)
          }
        }, 10)
      }, 1500)
    }

    const initial = setTimeout(cycle, 800)
    return () => clearTimeout(initial)
  }, [])

  const formatTime = (t: number) => {
    const seconds = Math.floor(t)
    const ms = Math.floor((t % 1) * 100)
    return `${seconds}.${ms.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <motion.div
        className="font-mono tabular-nums"
        animate={{
          color: phase === 'inspecting' ? '#d97706' : phase === 'done' ? '#059669' : '#111827'
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-7xl md:text-[120px] lg:text-[160px] font-black tracking-tighter leading-none">
          {phase === 'idle' ? '0.00' : formatTime(time)}
        </span>
      </motion.div>
      <motion.div
        className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mt-3"
        animate={{ opacity: phase === 'inspecting' ? 1 : 0.4 }}
      >
        {phase === 'inspecting' ? 'Inspection' : phase === 'solving' ? 'Solving...' : phase === 'done' ? 'Solved!' : ''}
      </motion.div>
    </div>
  )
}

// ─── FAQ Accordion ───
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
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

// ─── Horizontal Scroll Section ───
function HorizontalShowcase({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
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
      title: 'Split by Cube',
      description: 'Analyze your performance for each individual cube — no more mixed averages.',
      imageSrc: '/landing/Screenshot_40.png',
      accent: 'from-fuchsia-500/20 to-purple-500/20'
    },
    {
      title: 'Deep Statistics',
      description: 'Understand every solve with detailed performance metrics and trends.',
      imageSrc: '/landing/Screenshot_41.png',
      accent: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      title: 'Online Modes',
      description: 'Compete in real-time with cubers around the world.',
      imageSrc: '/landing/Screenshot_38.png',
      accent: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      title: 'Personal Profile',
      description: 'Track your progress and showcase your times publicly.',
      imageSrc: '/landing/Screenshot_43.png',
      accent: 'from-amber-500/20 to-orange-500/20'
    }
  ]

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4"
          >
            Feature Showcase
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
              level up
            </span>
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
              <div
                className={cn(
                  'relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br',
                  card.accent,
                  'transition-all duration-700 hover:border-gray-300 hover:shadow-2xl hover:shadow-fuchsia-500/10'
                )}
              >
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

// ─── Sticky Feature Reveal ───
function StickyFeatureReveal({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const features = [
    {
      icon: Timer,
      tag: 'Timer',
      title: 'A timer built for speed',
      description:
        'Customizable inspection, stackmat-style controls, and instant feedback. Every millisecond counts — and NexusTimer captures them all.',
      image: '/landing/Screenshot_40.png',
      color: 'text-fuchsia-400',
      glow: 'shadow-fuchsia-500/20'
    },
    {
      icon: BarChart3,
      tag: 'Analytics',
      title: 'Statistics that actually help',
      description:
        'Per-cube performance profiles, trend analysis, session comparisons, and deep metrics that reveal where your time is hiding.',
      image: '/landing/Screenshot_41.png',
      color: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    },
    {
      icon: Users,
      tag: 'Multiplayer',
      title: 'Compete in real time',
      description:
        'Create rooms, invite friends, and battle head-to-head. Perfect for club meetups or online sessions across the globe.',
      image: '/landing/Screenshot_38.png',
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/20'
    },
    {
      icon: Globe,
      tag: 'Community',
      title: 'Your public profile',
      description:
        'Showcase your collection, personal bests, and full trajectory. Connect with cubers worldwide and track your ranking.',
      image: '/landing/Screenshot_43.png',
      color: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    }
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })

  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, features.length - 1])
  const [current, setCurrent] = useState(0)

  useMotionValueEvent(activeIndex, 'change', (latest) => {
    setCurrent(Math.round(latest))
  })

  return (
    <section ref={containerRef} style={{ height: `${features.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-7xl w-full px-6 grid grid-cols-1 gap-12 lg:gap-20 items-center">
          {/* Left: Text content */}
          <div className="relative">
            {features.map((feature, index) => (
              <motion.div
                key={feature.tag}
                initial={false}
                animate={{
                  opacity: current === index ? 1 : 0,
                  y: current === index ? 0 : 30,
                  filter: current === index ? 'blur(0px)' : 'blur(8px)'
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn('absolute inset-0 flex flex-col justify-center w-fit mx-auto', index === 0 && 'relative')}
              >
                <div
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium mb-6 w-fit',
                    feature.color
                  )}
                >
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.tag}
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md">{feature.description}</p>

                {/* Progress dots */}
                <div className="flex gap-2 mt-10">
                  {features.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 rounded-full transition-all duration-500',
                        i === current ? 'w-8 bg-fuchsia-500' : 'w-2 bg-gray-200'
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Parallax Image Band ───
function ParallaxBand({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
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
      {/* Floating cube images with parallax */}
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
            { value: 17, suffix: '+', label: 'WCA Events' },
            { value: 10, suffix: '', label: 'Languages' },
            { value: 100, suffix: '%', label: 'Free forever' },
            { value: 5, suffix: '★', label: 'Open source' }
          ].map((stat, i) => (
            <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Scroll-Linked Section Reveal ───
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

// ===== MAIN PAGE =====
export default function Page() {
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ container: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.04], [1, 0.92])
  const heroBlur = useTransform(scrollYProgress, [0, 0.04], [0, 10])

  // Scroll-linked gradient orbs — positions shift and colors change organically
  const orb1X = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-200, 100, 400, 150, -100])
  const orb1Y = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-50, 200, 100, 350, 50])
  const orb1Scale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [1, 1.5, 0.8, 1.3])

  const orb2X = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [600, 350, 100, 500, 300])
  const orb2Y = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [100, -50, 250, 100, 400])
  const orb2Scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 1.3, 1.6, 0.9])

  const orb3X = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [200, 500, -50, 350])
  const orb3Y = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [400, 200, 350, 100])

  const orb4X = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [-100, 300, 600, 100])
  const orb4Y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [200, 400, 150, 300])
  const orb4Scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.4, 1])

  const orb5X = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [400, 50, 300, 500])
  const orb5Y = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [300, 100, 450, 200])

  // Color transitions via scroll-driven hue
  const orbHue1 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [300, 200, 40, 300])
  const orbHue2 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [270, 180, 280, 160])
  const orbBg1 = useTransform(orbHue1, (h) => `hsla(${h}, 70%, 80%, 0.2)`)
  const orbBg2 = useTransform(orbHue2, (h) => `hsla(${h}, 60%, 75%, 0.15)`)
  const orbBg3 = useTransform(orbHue1, (h) => `hsla(${h + 60}, 50%, 80%, 0.12)`)
  const orbBg4 = useTransform(orbHue2, (h) => `hsla(${h + 90}, 65%, 78%, 0.18)`)
  const orbBg5 = useTransform(orbHue1, (h) => `hsla(${h - 40}, 55%, 82%, 0.1)`)

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollY = e.currentTarget.scrollTop
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      setLastScrollY(currentScrollY)
    },
    [lastScrollY]
  )

  return (
    <div className="relative w-dvw h-dvh bg-gray-50 overflow-hidden">
      {/* Scroll-linked gradient orbs with dynamic colors */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          style={{ x: orb1X, y: orb1Y, scale: orb1Scale, backgroundColor: orbBg1 }}
          className="absolute w-[500px] h-[500px] rounded-full blur-[160px]"
        />
        <motion.div
          style={{ x: orb2X, y: orb2Y, scale: orb2Scale, backgroundColor: orbBg2 }}
          className="absolute w-[500px] h-[500px] rounded-full blur-[160px]"
        />
        <motion.div
          style={{ x: orb3X, y: orb3Y, backgroundColor: orbBg3 }}
          className="absolute w-[350px] h-[350px] rounded-full blur-[140px]"
        />
        <motion.div
          style={{ x: orb4X, y: orb4Y, scale: orb4Scale, backgroundColor: orbBg4 }}
          className="absolute w-[400px] h-[400px] rounded-full blur-[150px]"
        />
        <motion.div
          style={{ x: orb5X, y: orb5Y, backgroundColor: orbBg5 }}
          className="absolute w-[300px] h-[300px] rounded-full blur-[120px]"
        />
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex flex-col h-full text-gray-900 overflow-y-auto scroll-smooth"
      >
        {/* ═══ HEADER ═══ */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-full sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-gray-200"
        >
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                <Image className="invert p-0.5" src="/logo.png" alt="NexusTimer Logo" width={24} height={24} />
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-900">NexusTimer</span>
            </motion.div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              {[
                { href: '/people', label: 'People' },
                { href: '/algorithms', label: 'Algorithms' },
                { href: '/leaderboards', label: 'Leaderboards' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gray-900 transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 transition-colors duration-300 relative group"
              >
                GitHub
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
              >
                <Timer className="h-4 w-4 text-fuchsia-400" />
                <span className="hidden sm:inline">Start Timing</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.header>

        {/* ═══ MAIN ═══ */}
        <main className="flex-1">
          {/* ────── HERO ────── */}
          <motion.section
            style={{
              opacity: heroOpacity,
              scale: heroScale,
              filter: useTransform(heroBlur, (v) => `blur(${v}px)`)
            }}
            className="relative min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center px-6"
          >
            <div className="max-w-5xl mx-auto text-center mt-5">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs text-emerald-700 backdrop-blur-sm mb-10"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free and open source — forever
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <SolveTimerAnimation />
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-4"
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                  The timer that shows how you&apos;re{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500">
                    really improving
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4"
              >
                Performance profiles per cube. Deep analytics. Real-time competition.
              </motion.p>

              {/* Rotating categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10"
              >
                <span>Built for</span>
                <RotatingText
                  text={[
                    '3x3 Speedsolving',
                    'One-Handed',
                    'Megaminx',
                    'Pyraminx',
                    'Big Cubes',
                    'Square-1',
                    'Skewb',
                    'Clock'
                  ]}
                  duration={2000}
                  className="text-fuchsia-600 font-semibold"
                />
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link
                  href="/app"
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 text-white font-semibold px-8 py-4 text-sm hover:shadow-[0_0_60px_rgba(217,70,239,0.25)] transition-all duration-500 hover:scale-105"
                >
                  <Image
                    src="/landing/cube.gif"
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className="transition-transform group-hover:rotate-12"
                  />
                  Discover your performance
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/options?redirect=import"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white backdrop-blur-sm px-7 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Import your solves
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mt-12 flex items-center justify-center gap-4 text-xs text-gray-400"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 7].map((num, idx) => (
                    <motion.div
                      key={num}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.2 + idx * 0.1 }}
                    >
                      <Image
                        className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-lg"
                        src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                        alt="Community member"
                        width={28}
                        height={28}
                      />
                    </motion.div>
                  ))}
                </div>
                <span>Join a growing community of cubers</span>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2 text-gray-300"
              >
                <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* ────── STATS BAND with Parallax ────── */}
          <ParallaxBand scrollContainer={containerRef} />

          {/* ────── HORIZONTAL SCROLL SHOWCASE ────── */}
          <HorizontalShowcase scrollContainer={containerRef} />

          {/* ────── BRANDS MARQUEE ────── */}
          <section className="relative py-16 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8">
                Works with your favorite brands
              </p>
              <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
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
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-500"
                    >
                      {item}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ────── STICKY FEATURE REVEAL ────── */}
          <StickyFeatureReveal scrollContainer={containerRef} />

          {/* ────── FEATURES GRID ────── */}
          <ScrollRevealSection scrollContainer={containerRef}>
            <section className="relative py-24 md:py-32">
              <div className="mx-auto max-w-6xl px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Capabilities</p>
                  <h2 className="text-3xl md:text-5xl font-bold mb-5">
                    What{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
                      NexusTimer
                    </span>{' '}
                    can do
                  </h2>
                  <p className="text-gray-500 text-base max-w-lg mx-auto">
                    Every feature designed with one goal — help you get faster.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Timer,
                      title: 'A timer that adapts to you',
                      description:
                        'Customize your timing experience with adjustable settings, themes, and layouts to suit your preferences.'
                    },
                    {
                      icon: BarChart3,
                      title: 'Unique stats system',
                      description:
                        'Analyze results per cube and spot opportunities without altering your session averages.'
                    },
                    {
                      icon: Users,
                      title: 'Online Mode',
                      description:
                        'Create rooms, coordinate matches in real time. Perfect for meetups or online sessions.'
                    },
                    {
                      icon: Globe,
                      title: 'Connect with cubers',
                      description:
                        'Explore the worldwide community. Share your times and individual performance metrics.'
                    },
                    {
                      icon: AudioWaveform,
                      title: 'Learn Algorithms',
                      description: 'Built-in algorithm trainer to memorize and practice new algorithms effectively.'
                    },
                    {
                      icon: DatabaseZap,
                      title: 'Cross Platform Sync',
                      description: 'Access your data from any device. NexusTimer syncs your times via the cloud.'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="group relative rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 hover:border-fuchsia-300 transition-all duration-500 shadow-sm"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="p-2.5 rounded-xl bg-gray-100 border border-gray-200 w-fit mb-5 group-hover:bg-fuchsia-50 group-hover:border-fuchsia-200 transition-colors duration-300">
                          <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-fuchsia-500 transition-colors duration-300" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-fuchsia-700 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollRevealSection>

          {/* ────── HOW IT WORKS ────── */}
          <ScrollRevealSection scrollContainer={containerRef}>
            <section className="relative py-20 md:py-28">
              <div className="mx-auto max-w-5xl px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-20"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Getting Started</p>
                  <SectionHeading>How it works</SectionHeading>
                </motion.div>

                <div className="relative">
                  {/* Connecting line */}
                  <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
                    {[
                      {
                        number: 1,
                        title: 'Start or import',
                        desc: 'Use Nexus or import solves from any timer.',
                        icon: Zap
                      },
                      {
                        number: 2,
                        title: 'Train as usual',
                        desc: 'Just solve. Everything is categorized automatically.',
                        icon: Timer
                      },
                      {
                        number: 3,
                        title: 'Analyze',
                        desc: 'See performance trends after a short session.',
                        icon: BarChart3
                      },
                      {
                        number: 4,
                        title: 'Improve',
                        desc: 'Compare profiles and track long-term progress.',
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
                        <div className="relative z-10 h-20 w-20 rounded-2xl border border-fuchsia-200 bg-white backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-100 group-hover:border-fuchsia-400 group-hover:shadow-fuchsia-200 transition-all duration-500">
                          <step.icon className="h-7 w-7 text-fuchsia-500" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-400 mb-2">
                          Step {step.number}
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

          {/* ────── DESKTOP / MOBILE PREVIEW ────── */}
          <ScrollRevealSection scrollContainer={containerRef}>
            <section className="relative py-20 md:py-32 overflow-hidden">
              <div className="mx-auto max-w-7xl px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-center mb-16"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Cross Platform</p>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5">
                    Beautiful on{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
                      every device
                    </span>
                  </h2>
                  <p className="text-gray-500 text-base max-w-xl mx-auto">
                    Desktop, tablet, or phone — NexusTimer adapts seamlessly to your screen.
                  </p>
                </motion.div>

                <div className="relative flex items-center justify-center">
                  {/* Desktop mockup */}
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-4xl"
                  >
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50">
                      <div className="bg-gray-100 backdrop-blur-sm h-8 flex items-center px-4 gap-2 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                        </div>
                        <div className="mx-auto rounded-md bg-white px-16 py-0.5 text-[10px] text-gray-400">
                          nexustimer.pro
                        </div>
                      </div>
                      <Image
                        src="/app-desktop-view.png"
                        alt="NexusTimer desktop view"
                        width={1200}
                        height={750}
                        className="w-full"
                      />
                    </div>

                    {/* Mobile overlay */}
                    <motion.div
                      initial={{ opacity: 0, x: 40, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute -right-4 md:right-8 -bottom-8 md:-bottom-12 w-32 md:w-48"
                    >
                      <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-2xl shadow-gray-300/50 bg-white">
                        <Image
                          src="/app-mobile-view.png"
                          alt="NexusTimer mobile view"
                          width={300}
                          height={600}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Glow */}
                  <div className="absolute -inset-20 bg-gradient-to-r from-fuchsia-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl -z-10" />
                </div>
              </div>
            </section>
          </ScrollRevealSection>

          {/* ────── FEATURE COMPARISON TABLE ────── */}
          <FeatureTable />

          {/* ────── OFFICIAL EVENTS ────── */}
          <section className="relative py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Events</p>
                <SectionHeading>Built for official events</SectionHeading>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-5">
                  Focused on WCA official categories. Train for competitions with the same events you&apos;ll compete
                  in.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Speedcubers',
                    description:
                      'Train for 3x3, 2x2, 4x4, 5x5 and all official speed events. Track your progress with competition-ready statistics.',
                    highlight: 'WCA Speed Events',
                    icon: Zap
                  },
                  {
                    title: 'One-Handed Specialists',
                    description:
                      'Master OH with dedicated tracking. Analyze your one-handed solves separately from your regular times.',
                    highlight: '3x3 OH Focus',
                    icon: Shield
                  },
                  {
                    title: 'Big Cube Enthusiasts',
                    description:
                      'Track performance across 4x4, 5x5, 6x6, and 7x7. Compare your times and identify improvement areas.',
                    highlight: '4x4 — 7x7',
                    icon: BarChart3
                  },
                  {
                    title: 'Non-NxN Solvers',
                    description:
                      'Practice Pyraminx, Skewb, Square-1, Megaminx, and Clock. All official WCA events supported.',
                    highlight: 'Pyraminx, Skewb, SQ1...',
                    icon: Smartphone
                  }
                ].map((profile, index) => (
                  <motion.div
                    key={profile.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-fuchsia-300 hover:bg-gray-50 transition-all duration-500 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-fuchsia-50 border border-fuchsia-200">
                          <profile.icon className="h-4 w-4 text-fuchsia-500" />
                        </div>
                        <span className="text-[11px] font-medium text-fuchsia-600 tracking-wide">
                          {profile.highlight}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-fuchsia-700 transition-colors duration-300">
                        {profile.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{profile.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ────── TESTIMONIALS ────── */}
          <section className="relative py-20 md:py-28">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Testimonials</p>
                <SectionHeading>What users say</SectionHeading>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    text: '"Switched from other timers and never looked back. The Clash Mode is a game-changer for our club."',
                    user: '@cubeOrigin',
                    avatar: 9
                  },
                  {
                    text: '"Love the clean UI and that it\'s free. Cloud backup keeps my times safe across devices."',
                    user: '@layersLast',
                    avatar: 5
                  },
                  {
                    text: '"Import and export just works. Stats per cube helped me target my weak spots."',
                    user: '@OH_enthusiast',
                    avatar: 4
                  }
                ].map((t, i) => (
                  <motion.div
                    key={t.user}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-gray-300 hover:bg-gray-50 transition-all duration-500 shadow-sm"
                  >
                    <div className="flex items-center gap-1 text-amber-300/80 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon key={j} className="h-3.5 w-3.5 fill-amber-300/70" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{t.text}</p>
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <Image
                        className="h-7 w-7 rounded-full border border-gray-200"
                        src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${t.avatar}.png`}
                        alt="User avatar"
                        width={28}
                        height={28}
                      />
                      <span className="font-medium">{t.user}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ────── FAQ ────── */}
          <section className="relative py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-14"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">FAQ</p>
                <SectionHeading>Frequently asked questions</SectionHeading>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col gap-3"
              >
                <FAQItem
                  question="Is NexusTimer really free?"
                  answer="Yes. NexusTimer is free and we plan to keep it that way."
                />
                <FAQItem
                  question="Can I import from other timers?"
                  answer="Absolutely. We support import/export with popular timers like csTimer, Twisty Timer, CubeDesk."
                />
                <FAQItem
                  question="Does it work across devices?"
                  answer="Yes, NexusTimer supports mobile and desktop. Sync your data via the cloud for access on any device."
                />
                <FAQItem
                  question="How do Clash rooms work?"
                  answer="Create a room, invite your friends, and synchronize rounds in real time. Great for meetups or online sessions."
                />
                <FAQItem
                  question="Why do I need to create cube collections?"
                  answer="We have a unique stats system that tracks performance per cube. This helps you identify strengths and weaknesses with each cube, without session averages being affected."
                />
                <FAQItem
                  question="How does NexusTimer sustain itself?"
                  answer="Currently, NexusTimer runs with all the costs covered. We are exploring sustainable funding options to ensure its longevity."
                />
              </motion.div>
            </div>
          </section>

          {/* ────── FINAL CTA ────── */}
          <ScrollRevealSection scrollContainer={containerRef}>
            <section className="relative py-20 md:py-32">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-4xl px-6"
              >
                <div className="relative rounded-[2rem] border border-fuchsia-200 overflow-hidden">
                  <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-fuchsia-100 via-purple-100 to-pink-100 blur-sm" />

                  <div className="relative bg-white backdrop-blur-xl rounded-[2rem] p-12 md:p-20 text-center">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <Image
                        src="/bg.png"
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-purple-100 border border-fuchsia-200 mb-8"
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
                        Ready to level up?
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-500 text-base md:text-lg mb-10 max-w-md mx-auto"
                      >
                        Less routine, more cubing joy. All refined cubing tools — right in your device, for free.
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
                          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold px-8 py-4 text-sm hover:shadow-[0_0_60px_rgba(217,70,239,0.3)] transition-all duration-500 hover:scale-105"
                        >
                          Go to the App
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                          href="/options?redirect=import"
                          className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white backdrop-blur-sm px-7 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                        >
                          Import your solves
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </ScrollRevealSection>
        </main>

        {/* ═══ FOOTER ═══ */}
        <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/logo.png" alt="NexusTimer Logo" width={32} height={32} />
                  <span className="text-xl font-bold text-gray-900">NexusTimer</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                  The ultimate performance profile for cubers. Track, analyze, and improve your solves with advanced
                  statistics.
                </p>
                <Image
                  src="/utils/android-apk.webp"
                  alt="Download Nexus Connect App"
                  width={200}
                  height={60}
                  className="mt-6 -ms-4"
                  unoptimized
                />
              </div>

              <div className="grid-cols-3 gap-8 hidden md:grid">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Product</h4>
                  <ul className="space-y-3">
                    {[
                      { href: '/app', label: 'Timer App' },
                      { href: '/stats', label: 'Statistics' },
                      { href: '/free-play', label: 'Multiplayer' },
                      { href: '/algorithms', label: 'Algorithms' },
                      { href: '/leaderboards', label: 'Leaderboards' }
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Company</h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="mailto:contact.nexustimer@gmail.com"
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/privacy-policy"
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms-of-service"
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Community</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="https://discord.gg/eCgTKcavec"
                        target="_blank"
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      >
                        Discord Server
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com/NexusTimer"
                        target="_blank"
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                      >
                        GitHub
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-xs text-gray-400 italic">
                NexusTimer is an independent project for the cubing community.
              </span>
              <span className="text-xs text-gray-400">
                © {new Date().getFullYear()} NexusTimer. All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ===== SUB-COMPONENTS =====

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
        <span className="text-fuchsia-500">{suffix}</span>
      </span>
      <p className="text-xs text-gray-400 mt-3 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-fuchsia-500 to-purple-500">
      {children}
    </h2>
  )
}

function FeatureTable() {
  const TABLES_DATA = [
    {
      title: 'Built-in Core Features',
      description: 'Essential timer capabilities',
      features: [
        {
          name: 'Random State Scrambles',
          description: 'Instead of random moves, get scrambles that put your cube in a random state.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Cross-platform support',
          description: 'Access the application on multiple devices and operating systems.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Import other timers',
          description: 'Easily import and export your data to and from other popular timers.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: 'Offline Mode',
          description: 'Use the timer without an internet connection.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'cross',
          twistyTimer: 'check'
        },
        {
          name: 'Statistics per cube',
          description: 'Analyze your performance for each individual cube.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Cloud Sync',
          description: 'Sync your data across multiple devices via the cloud.',
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Online Mode',
          description: 'Create rooms and coordinate matches in real time with other users.',
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        }
      ]
    },
    {
      title: 'Statistics & Analysis',
      description: 'In-depth performance insights',
      features: [
        {
          name: 'Global Statistics',
          description: 'Overall stats including averages, best/worst times, and more.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Session Statistics',
          description: 'Detailed session stats including averages, best/worst times, and more.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Cube-specific Stats',
          description: 'Detailed statistics for each individual cube.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Performance Graphs',
          description: 'Visualize your solving times and trends over time.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'partial',
          twistyTimer: 'partial'
        }
      ]
    },
    {
      title: 'Social & Community',
      description: 'User engagement and social features',
      features: [
        {
          name: 'Profile System',
          description: 'Create and customize your user profile.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Compare Profiles',
          description: 'View and compare profiles of other users.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Personal Bests',
          description: 'Showcase your best times on your profile including averages.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Cubes Owned',
          description: 'Show the cubes you own on your profile.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Trajectory Progress',
          description: 'Show your full solve history and progress over time.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        }
      ]
    }
  ]

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 mb-4">Comparison</p>
          <SectionHeading>For cubers who want more than a timer</SectionHeading>
          <p className="text-sm md:text-base text-gray-500 mt-5">
            NexusTimer offers unique features that set it apart from other popular timers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {TABLES_DATA.map((table, index) => (
            <table key={index} className="w-full table-auto border-collapse max-w-4xl mx-auto mb-2 last:mb-0">
              <thead>
                <tr className="border-b border-fuchsia-200">
                  <th className="py-4 text-left text-gray-700 ps-4 w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{table.title}</p>
                      <p className="text-xs font-normal text-gray-400">{table.description}</p>
                    </div>
                  </th>
                  <th className="py-4 text-gray-700 px-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/logo.png"
                        alt="Nexus Timer logo"
                        width={64}
                        height={64}
                        className="size-5"
                        unoptimized
                      />
                      <span className="text-xs font-semibold text-fuchsia-600">NXTimer</span>
                    </div>
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom px-3 font-medium">csTimer</th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Cube Desk
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Twisty Timer
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.features.map((feature, fIndex) => (
                  <tr key={fIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 text-sm text-gray-700 ps-4">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{feature.description}</div>
                    </td>
                    <td>
                      <RatedIcon type={feature.nxTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td>
                      <RatedIcon type={feature.csTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.cubeDesk as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.twistyTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

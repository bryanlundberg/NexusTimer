'use client'

import Link from 'next/link'
import Dither from '@/components/ui/shadcn-io/dither'
import {
  ArrowRight,
  AudioWaveform,
  BarChart3,
  ChevronDown,
  DatabaseZap,
  Globe,
  StarIcon,
  Timer,
  Users
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef, useCallback } from 'react'

// --- Animated counter hook ---
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

// --- Solve timer simulation ---
function SolveTimerAnimation() {
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'inspecting' | 'solving' | 'done'>('idle')

  useEffect(() => {
    const cycle = () => {
      setPhase('inspecting')
      setTime(0)

      setTimeout(() => {
        setPhase('solving')
        const solveTarget = 7.5 + Math.random() * 5 // 7.5 - 12.5s
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
          color: phase === 'inspecting' ? '#fbbf24' : phase === 'done' ? '#34d399' : '#ffffff'
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-7xl md:text-[120px] lg:text-[150px] font-black tracking-tighter leading-none">
          {phase === 'idle' ? '0.00' : formatTime(time)}
        </span>
      </motion.div>
      <motion.div
        className="text-xs uppercase tracking-[0.3em] text-white/40 text-center mt-3"
        animate={{ opacity: phase === 'inspecting' ? 1 : 0.4 }}
      >
        {phase === 'inspecting' ? 'Inspection' : phase === 'solving' ? 'Solving...' : phase === 'done' ? 'Solved!' : ''}
      </motion.div>
    </div>
  )
}

// --- FAQ Accordion ---
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      layout
    >
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left">
        <span className="text-sm font-semibold text-white/90 pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-white/50 shrink-0" />
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
            <p className="px-6 pb-5 text-sm text-white/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ===== MAIN PAGE =====
export default function Page() {
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ container: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.08], [0, -60])

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
    <div className="relative w-dvw h-dvh bg-black overflow-hidden">
      {/* Animated background */}
      <Dither
        waveSpeed={0.02}
        waveFrequency={5}
        waveAmplitude={0.5}
        waveColor={[0.2, 0.111, 0.3]}
        colorNum={4}
        pixelSize={3}
        enableMouseInteraction={true}
        mouseRadius={1.2}
        className="absolute inset-0"
      />

      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Content overlay */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex flex-col h-full text-white overflow-y-auto scroll-smooth"
      >
        {/* Header / Nav */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-full sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5"
        >
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                <Image className="invert-100 p-0.5" src="/logo.png" alt="NexusTimer Logo" width={24} height={24} />
              </div>
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                NexusTimer
              </span>
            </motion.div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
              {[
                { href: '/people', label: 'People' },
                { href: '/algorithms', label: 'Algorithms' },
                { href: '/leaderboards', label: 'Leaderboards' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-300 relative group"
              >
                GitHub
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-fuchsia-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              >
                <Timer className="h-4 w-4 text-fuchsia-400" />
                <span className="hidden sm:inline">Start Timing</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main */}
        <main className="flex-1">
          {/* ====== HERO ====== */}
          <motion.section
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="relative min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center px-6"
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300 backdrop-blur-sm mb-10"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free and open source — forever
              </motion.div>

              {/* Animated Timer Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white/90">
                  The timer that shows how you&apos;re{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400">
                    really improving
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-4"
              >
                Performance profiles per cube. Deep analytics. Real-time competition.
              </motion.p>

              {/* Rotating categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center justify-center gap-2 text-sm text-white/40 mb-10"
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
                  className="text-fuchsia-300 font-semibold"
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
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black font-semibold px-7 py-3.5 text-sm hover:shadow-[0_0_40px_rgba(217,70,239,0.3)] transition-all duration-500 hover:scale-105"
                >
                  <Image
                    src="/landing/cube.gif"
                    alt="Animated Rubik's cube icon"
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
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-sm text-white/80 hover:bg-white/10 hover:border-white/25 transition-all duration-300"
                >
                  Import your solves
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mt-10 flex items-center justify-center gap-4 text-xs text-white/50"
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
                        className="inline-block h-7 w-7 rounded-full border-2 border-black/50 shadow-lg"
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
                className="flex flex-col items-center gap-2 text-white/30"
              >
                <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* ====== STATS BAND ====== */}
          <section className="relative py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {[
                  { value: 17, suffix: '+', label: 'WCA Events' },
                  { value: 10, suffix: '', label: 'Languages' },
                  { value: 100, suffix: '%', label: 'Free forever' },
                  { value: 5, suffix: '★', label: 'Open source' }
                ].map((stat, i) => (
                  <StatItem
                    key={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ====== SHOWCASE SCREENSHOTS ====== */}
          <section className="relative py-16 md:py-28 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
                  Everything you need to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
                    level up
                  </span>
                </h2>
                <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
                  From deep analytics to real-time competition — the features that make NexusTimer the ultimate choice
                  for serious cubers.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {[
                  {
                    title: 'Split by Cube',
                    description: 'Analyze your performance for each individual cube — no more mixed averages.',
                    imageSrc: '/landing/Screenshot_40.png'
                  },
                  {
                    title: 'Deep Statistics',
                    description: 'Understand every solve with detailed performance metrics and trends.',
                    imageSrc: '/landing/Screenshot_41.png'
                  },
                  {
                    title: 'Online Modes',
                    description: 'Compete in real-time with cubers around the world.',
                    imageSrc: '/landing/Screenshot_38.png'
                  },
                  {
                    title: 'Personal Profile',
                    description: 'Track your progress and showcase your times publicly.',
                    imageSrc: '/landing/Screenshot_43.png'
                  }
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ActivationMomentCard title={card.title} description={card.description} imageSrc={card.imageSrc} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ====== BRANDS ====== */}
          <section className="relative py-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl px-6"
            >
              <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30 mb-6">
                Works with your favorite brands
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng', 'And More..'].map(
                  (item, index) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm hover:border-fuchsia-400/30 hover:text-white/90 transition-colors duration-300"
                    >
                      {item}
                    </motion.span>
                  )
                )}
              </div>
            </motion.div>
          </section>

          {/* ====== FEATURES GRID ====== */}
          <section className="relative py-20 md:py-28">
            <div className="mx-auto max-w-5xl px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center text-3xl md:text-4xl font-bold mb-4"
              >
                What{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
                  NexusTimer
                </span>{' '}
                can do for you
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center text-white/40 text-base mb-14 max-w-lg mx-auto"
              >
                Every feature designed with one goal — help you get faster.
              </motion.p>

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
                    description: 'Explore the worldwide community. Share your times and individual performance metrics.'
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
                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.05] hover:border-fuchsia-500/20 transition-all duration-500"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit mb-5 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/20 transition-colors duration-300">
                        <feature.icon className="h-5 w-5 text-white/50 group-hover:text-fuchsia-400 transition-colors duration-300" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-fuchsia-100 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ====== HOW IT WORKS ====== */}
          <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <SectionHeading>How it works</SectionHeading>
              </motion.div>

              <div className="relative">
                {/* Timeline line */}
                <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                  {[
                    { number: 1, title: 'Start or import', desc: 'Use Nexus or import solves from any timer.' },
                    {
                      number: 2,
                      title: 'Train as usual',
                      desc: 'Just solve. Everything is categorized automatically.'
                    },
                    { number: 3, title: 'Analyze', desc: 'See performance trends after a short session.' },
                    { number: 4, title: 'Improve', desc: 'Compare profiles and track long-term progress.' }
                  ].map((step, i) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className="relative flex flex-col items-center text-center"
                    >
                      <div className="relative z-10 h-16 w-16 rounded-full border border-fuchsia-500/30 bg-black flex items-center justify-center text-xl font-bold text-fuchsia-300 mb-5 shadow-lg shadow-fuchsia-500/10">
                        {step.number}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ====== FEATURE COMPARISON TABLE ====== */}
          <FeatureTable />

          {/* ====== OFFICIAL EVENTS ====== */}
          <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
              >
                <SectionHeading>Built for official events</SectionHeading>
                <p className="text-white/50 text-lg max-w-2xl mx-auto mt-4">
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
                    highlight: 'WCA Speed Events'
                  },
                  {
                    title: 'One-Handed Specialists',
                    description:
                      'Master OH with dedicated tracking. Analyze your one-handed solves separately from your regular times.',
                    highlight: '3x3 OH Focus'
                  },
                  {
                    title: 'Big Cube Enthusiasts',
                    description:
                      'Track performance across 4x4, 5x5, 6x6, and 7x7. Compare your times and identify improvement areas.',
                    highlight: '4x4 - 7x7'
                  },
                  {
                    title: 'Non-NxN Solvers',
                    description:
                      'Practice Pyraminx, Skewb, Square-1, Megaminx, and Clock. All official WCA events supported.',
                    highlight: 'Pyraminx, Skewb, SQ1...'
                  }
                ].map((profile, index) => (
                  <motion.div
                    key={profile.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-fuchsia-400/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[11px] font-medium text-fuchsia-300 mb-4 tracking-wide">
                        {profile.highlight}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-fuchsia-200 transition-colors duration-300">
                        {profile.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed">{profile.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ====== TESTIMONIALS ====== */}
          <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-14"
              >
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
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
                  >
                    <div className="flex items-center gap-1 text-amber-300/80 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon key={j} className="h-3.5 w-3.5 fill-amber-300/70" />
                      ))}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed mb-5">{t.text}</p>
                    <div className="flex items-center gap-2.5 text-xs text-white/40">
                      <Image
                        className="h-7 w-7 rounded-full border border-white/10"
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

          {/* ====== FAQ ====== */}
          <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-14"
              >
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

          {/* ====== CTA ====== */}
          <section className="relative py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-4xl px-6"
            >
              <div className="relative rounded-3xl border border-fuchsia-500/20 overflow-hidden">
                {/* Animated gradient border glow */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />

                <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-10 md:p-16 text-center">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <Image
                      src="/bg.png"
                      alt="Background pattern"
                      width={400}
                      height={400}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-5"
                    >
                      Ready to level up?
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-white/50 text-base md:text-lg mb-10 max-w-md mx-auto"
                    >
                      Less routine, more cubing joy. All refined cubing tools — right in your device, for free.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Link
                        href="/app"
                        className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold px-8 py-4 text-sm hover:shadow-[0_0_50px_rgba(217,70,239,0.4)] transition-all duration-500 hover:scale-105"
                      >
                        Go to the App
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        {/* ====== FOOTER ====== */}
        <footer className="w-full border-t border-white/[0.06] bg-black/40 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/logo.png" alt="NexusTimer Logo" width={32} height={32} className="invert" />
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    NexusTimer
                  </span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed max-w-md">
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
                  <h4 className="text-xs font-semibold text-white/60 mb-6 uppercase tracking-[0.15em]">Product</h4>
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
                          className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white/60 mb-6 uppercase tracking-[0.15em]">Company</h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="mailto:contact.nexustimer@gmail.com"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/privacy-policy"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms-of-service"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white/60 mb-6 uppercase tracking-[0.15em]">Community</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="https://discord.gg/eCgTKcavec"
                        target="_blank"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        Discord Server
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com/NexusTimer"
                        target="_blank"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        GitHub
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-xs text-white/30 italic">
                NexusTimer is an independent project for the cubing community.
              </span>
              <span className="text-xs text-white/30">
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
      <span ref={ref} className="text-4xl md:text-5xl font-black text-white tabular-nums">
        {count}
        <span className="text-fuchsia-400">{suffix}</span>
      </span>
      <p className="text-sm text-white/40 mt-2 uppercase tracking-[0.15em]">{label}</p>
    </motion.div>
  )
}

function ActivationMomentCard({
  title,
  description,
  imageSrc,
  className
}: {
  title: string
  description: string
  imageSrc: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative aspect-[16/10] md:aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-fuchsia-500/20 hover:shadow-[0_0_60px_rgba(217,70,239,0.08)]',
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={`${title} - ${description}`}
        width={800}
        height={800}
        className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-10">
        <h3 className="font-bold text-xl text-white mb-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {title}
        </h3>
        <p className="text-sm text-white/80 leading-relaxed transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75">
          {description}
        </p>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fbcfe8] via-fuchsia-300 to-purple-300 [text-shadow:0_2px_30px_rgba(217,70,239,0.3)]">
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
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <SectionHeading>For cubers who want more than a timer</SectionHeading>
          <p className="text-sm md:text-base text-white/40 mt-4">
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
                <tr className="border-b border-fuchsia-500/20">
                  <th className="py-4 text-left text-white/80 ps-4 w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{table.title}</p>
                      <p className="text-xs font-normal text-white/40">{table.description}</p>
                    </div>
                  </th>
                  <th className="py-4 text-white/80 px-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/logo.png"
                        alt="Nexus Timer logo"
                        width={64}
                        height={64}
                        className="invert size-5"
                        unoptimized
                      />
                      <span className="text-xs font-semibold text-fuchsia-300">NXTimer</span>
                    </div>
                  </th>
                  <th className="py-4 text-xs text-white/50 align-bottom px-3 font-medium">csTimer</th>
                  <th className="py-4 text-xs text-white/50 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Cube Desk
                  </th>
                  <th className="py-4 text-xs text-white/50 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Twisty Timer
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.features.map((feature, fIndex) => (
                  <tr key={fIndex} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 text-sm text-white/70 ps-4">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-white/40 mt-0.5">{feature.description}</div>
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

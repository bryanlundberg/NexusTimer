'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Bluetooth, Trophy, Users, User, LineChart, ArrowLeftRight, BookOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { CubeGridTexture } from './CubeDecor'
import { Reveal } from './Reveal'

function formatFake(ms: number) {
  const s = Math.floor(ms / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  return `${s}.${String(cs).padStart(2, '0')}`
}

function TickingTime({ base, className }: { base: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const [ms, setMs] = useState(base)

  useEffect(() => {
    if (!inView || reduce) return
    const id = setInterval(() => setMs((m) => (m > base + 4000 ? base : m + 30)), 30)
    return () => clearInterval(id)
  }, [inView, reduce, base])

  return (
    <span ref={ref} className={cn('font-mono tabular-nums', className)}>
      {formatFake(ms)}
    </span>
  )
}

function SmartCubeVisual() {
  const reduce = useReducedMotion()
  const moves = ['R', "U'", 'F2', "L'"]
  return (
    <div className="relative flex h-24 items-center justify-center overflow-hidden">
      {/* radar rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-[var(--cube-blue)]"
          style={{ width: 44, height: 44 }}
          animate={reduce ? undefined : { scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--cube-blue)]/12 ring-1 ring-[var(--cube-blue)]/30">
        <Bluetooth className="h-5 w-5 text-[var(--cube-blue)]" />
      </span>
      {moves.map((m, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-xs font-bold text-gray-900/70"
          style={{ left: `${14 + i * 22}%`, bottom: 4 }}
          animate={reduce ? { opacity: 0.5 } : { y: [6, -64], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'linear' }}
        >
          {m}
        </motion.span>
      ))}
    </div>
  )
}

function CompareVisual() {
  const reduce = useReducedMotion()
  const stats = ['single', 'ao5', 'ao12']
  const users = [
    { name: 'redsito', avatar: 3, times: ['5.87', '7.31', '8.02'] },
    { name: 'aki_3x3', avatar: 9, times: ['6.02', '7.02', '8.11'] },
    { name: 'mia', avatar: 5, times: ['6.40', '7.55', '7.89'] },
    { name: 'cubeghost', avatar: 4, times: ['7.12', '8.20', '9.04'] }
  ]
  const best = stats.map((_, c) => Math.min(...users.map((u) => parseFloat(u.times[c]))))

  const COLS = 'grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] items-center gap-2'

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`${COLS} px-3 pb-1`}>
        <span />
        {stats.map((s) => (
          <span key={s} className="text-right text-[9px] uppercase tracking-[0.2em] text-gray-500">
            {s}
          </span>
        ))}
      </div>
      {users.map((u, i) => (
        <motion.div
          key={u.name}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`${COLS} rounded-lg border border-gray-900/8 bg-white/70 px-3 py-2`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Image
              src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${u.avatar}.png`}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full border-2 border-gray-900/10"
            />
            <span className="truncate text-xs font-semibold text-gray-800">{u.name}</span>
          </span>
          {u.times.map((tm, c) => (
            <span
              key={c}
              className={cn(
                'text-right font-mono text-xs tabular-nums sm:text-sm',
                parseFloat(tm) === best[c] ? 'font-bold text-[var(--cube-green)]' : 'text-gray-500'
              )}
            >
              {tm}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function AlgorithmsVisual() {
  const reduce = useReducedMotion()
  const moves = ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
  const face = [1, 1, 0, 1, 1, 1, 0, 1, 0]
  return (
    <div className="flex items-center gap-4">
      <div className="grid shrink-0 grid-cols-3 gap-1">
        {face.map((on, i) => (
          <motion.span
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="h-4 w-4 rounded-[3px]"
            style={{ backgroundColor: on ? 'var(--cube-yellow)' : 'rgba(0,0,0,0.10)' }}
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">OLL 27 · Sune</p>
        <div className="flex flex-wrap gap-1.5">
          {moves.map((m, i) => (
            <motion.span
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.09 }}
              className="rounded-md border border-gray-900/8 bg-white/70 px-2 py-1 font-mono text-xs font-semibold text-gray-800"
            >
              {m}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeaderboardVisual() {
  const reduce = useReducedMotion()
  const rows = [
    { rank: 1, name: 'aki_3x3', time: '5.87', color: 'var(--cube-yellow)' },
    { rank: 2, name: 'cubeghost', time: '6.12', color: 'var(--cube-white)' },
    { rank: 3, name: 'redsito', time: '6.40', color: 'var(--cube-orange)' }
  ]
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.rank}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative flex items-center gap-3 overflow-hidden rounded-lg border border-gray-900/8 bg-white/70 px-3 py-2',
            i === 0 && 'ring-1 ring-[var(--cube-yellow)]/50'
          )}
        >
          {i === 0 && !reduce && (
            <motion.span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
            />
          )}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-black text-gray-900"
            style={{ backgroundColor: r.color }}
          >
            {r.rank}
          </span>
          <span className="flex-1 truncate text-xs font-semibold text-gray-800">{r.name}</span>
          <span className="font-mono text-xs tabular-nums text-gray-500">{r.time}</span>
        </motion.div>
      ))}
    </div>
  )
}

function RoomVisual() {
  const reduce = useReducedMotion()
  const lanes = [
    { name: 'you', color: 'var(--cube-green)', dur: 3.2, base: 6480 },
    { name: 'mia', color: 'var(--cube-blue)', dur: 3.9, base: 7150 }
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cube-red)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cube-red)]" />
        </span>
        LIVE
      </div>
      {lanes.map((l) => (
        <div key={l.name} className="flex items-center gap-3">
          <span className="w-8 text-[11px] font-semibold text-gray-600">{l.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-900/8">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: l.color }}
              animate={reduce ? { width: '70%' } : { width: ['4%', '96%', '4%'] }}
              transition={{ duration: l.dur * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <TickingTime base={l.base} className="w-10 text-right text-xs text-gray-700" />
        </div>
      ))}
    </div>
  )
}

function ProfileVisual() {
  const reduce = useReducedMotion()
  const pbs = [
    { label: 'single', value: '5.87' },
    { label: 'ao5', value: '7.31' },
    { label: 'ao12', value: '8.02' }
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Image
          src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border-2 border-gray-900/10"
        />
        <div>
          <p className="text-xs font-bold text-gray-900">redsito</p>
          <p className="text-[10px] text-gray-500">3×3 main · GAN 356</p>
        </div>
      </div>
      <div className="flex gap-2">
        {pbs.map((pb, i) => (
          <motion.div
            key={pb.label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: 90 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-lg border border-gray-900/8 bg-white/70 px-2 py-1.5 text-center"
          >
            <p className="font-mono text-sm font-bold tabular-nums text-gray-900">{pb.value}</p>
            <p className="text-[9px] uppercase tracking-wider text-gray-500">{pb.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StatsVisual() {
  const reduce = useReducedMotion()
  const series = [
    {
      label: '3×3',
      value: '8.9',
      color: 'var(--cube-blue)',
      d: 'M30 26 C 65 34, 100 26, 135 38 S 200 46, 246 52',
      end: { x: 246, y: 52 },
      bubble: { x: 176, y: 24, w: 62 },
      ink: '#ffffff',
      dash: '5 5',
      width: 2,
      opacity: 0.7,
      delay: 0.2
    },
    {
      label: 'GAN 356',
      value: '8.0',
      color: 'var(--cube-green)',
      d: 'M30 34 C 65 46, 100 34, 135 48 S 200 62, 246 76',
      end: { x: 246, y: 76 },
      bubble: { x: 160, y: 86, w: 82 },
      ink: '#10231a',
      dash: undefined,
      width: 2.5,
      opacity: 1,
      delay: 0.45
    }
  ]
  return (
    <svg viewBox="0 0 260 110" className="h-32 w-full" aria-hidden>
      {[
        { y: 18, tick: '10.0' },
        { y: 48, tick: '9.0' },
        { y: 78, tick: '8.0' }
      ].map((g) => (
        <g key={g.y}>
          <line x1="26" y1={g.y} x2="260" y2={g.y} stroke="currentColor" className="text-gray-900/8" strokeWidth="1" />
          <text
            x="0"
            y={g.y + 3}
            fill="currentColor"
            className="text-gray-900/35"
            style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 8 }}
          >
            {g.tick}
          </text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.label}>
          <motion.path
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeDasharray={s.dash}
            style={{ opacity: s.opacity }}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeInOut', delay: s.delay }}
          />
          <motion.circle
            cx={s.end.x}
            cy={s.end.y}
            r="3.5"
            fill={s.color}
            style={{ opacity: s.opacity }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: s.delay + 1.5, type: 'spring', stiffness: 300, damping: 15 }}
          />
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: s.delay + 1.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect
              x={s.bubble.x}
              y={s.bubble.y}
              width={s.bubble.w}
              height="18"
              rx="9"
              fill={s.color}
              opacity={s.opacity}
            />
            <text
              x={s.bubble.x + s.bubble.w / 2}
              y={s.bubble.y + 12.5}
              textAnchor="middle"
              fill={s.ink}
              fontWeight="700"
              style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 9 }}
            >
              {s.label} {s.value}
            </text>
          </motion.g>
        </g>
      ))}
    </svg>
  )
}

function BentoCard({
  icon: Icon,
  accent,
  title,
  desc,
  visual,
  className,
  delay = 0
}: {
  icon: React.ElementType
  accent: string
  title: string
  desc: string
  visual: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-gray-900/10 bg-gray-900/[0.03] p-6',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `color-mix(in oklch, ${accent} 15%, transparent)` }}
        >
          <Icon className="size-4" style={{ color: accent }} />
        </span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mb-5 mt-2.5 text-sm leading-relaxed text-gray-600 text-pretty">{desc}</p>

      <div className="mt-auto border-t border-gray-900/5 pt-5">{visual}</div>
    </motion.div>
  )
}

export default function FeatureBento() {
  const t = useTranslations('LandingPage.bento')

  return (
    <section className="lp-cv relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-gray-900"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)'
        }}
      >
        <CubeGridTexture opacity={0.028} />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">{t('label')}</p>
          <h2 className="font-display text-balance text-3xl font-bold tracking-[-0.02em] text-gray-900 md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-gray-600 md:text-base text-pretty">{t('subtitle')}</p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-6">
          <BentoCard
            icon={ArrowLeftRight}
            accent="var(--cube-red)"
            title={t('compare-title')}
            desc={t('compare-desc')}
            visual={<CompareVisual />}
            className="md:col-span-4"
          />
          <BentoCard
            icon={Bluetooth}
            accent="var(--cube-blue)"
            title={t('smart-title')}
            desc={t('smart-desc')}
            visual={<SmartCubeVisual />}
            className="md:col-span-2"
            delay={0.08}
          />
          <BentoCard
            icon={Trophy}
            accent="var(--cube-yellow)"
            title={t('lb-title')}
            desc={t('lb-desc')}
            visual={<LeaderboardVisual />}
            className="md:col-span-2"
            delay={0.05}
          />
          <BentoCard
            icon={Users}
            accent="var(--cube-green)"
            title={t('online-title')}
            desc={t('online-desc')}
            visual={<RoomVisual />}
            className="md:col-span-2"
            delay={0.1}
          />
          <BentoCard
            icon={User}
            accent="var(--cube-orange)"
            title={t('profile-title')}
            desc={t('profile-desc')}
            visual={<ProfileVisual />}
            className="md:col-span-2"
            delay={0.15}
          />
          <BentoCard
            icon={BookOpen}
            accent="var(--cube-blue)"
            title={t('algs-title')}
            desc={t('algs-desc')}
            visual={<AlgorithmsVisual />}
            className="md:col-span-3"
            delay={0.05}
          />
          <BentoCard
            icon={LineChart}
            accent="var(--cube-green)"
            title={t('stats-title')}
            desc={t('stats-desc')}
            visual={<StatsVisual />}
            className="md:col-span-3"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  )
}

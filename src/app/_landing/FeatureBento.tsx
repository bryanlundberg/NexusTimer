'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Bluetooth, Trophy, User, LineChart, ArrowLeftRight, BookOpen, TrendingDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { CubeGridTexture } from './CubeDecor'
import { Reveal } from './Reveal'

function SmartCubeVisual() {
  const reduce = useReducedMotion()
  const moves = ['R', "U'", 'F2', "L'"]
  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden">
      {/* radar rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-[var(--cube-blue)]"
          style={{ width: 80, height: 80 }}
          animate={reduce ? undefined : { scale: [1, 1.9], opacity: [0.45, 0] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* circular 3D cube preview (white frame clipped away) */}
      <span className="relative z-10 flex size-20 items-center justify-center rounded-full ring-1 ring-gray-900/10">
        <video
          src="/landing/cube3d.webm"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="size-20 rounded-full object-cover"
        />
        {/* soft edge fade so the white recording blends into the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 10px 6px #fff' }}
        />
        {/* bluetooth chip */}
        <span className="absolute -bottom-1 -right-1 z-20 flex size-6 items-center justify-center rounded-full bg-[var(--cube-blue)] shadow-md ring-2 ring-white">
          <Bluetooth className="size-3.5 text-white" />
        </span>
      </span>

      {moves.map((m, i) => (
        <motion.span
          key={i}
          className="absolute z-20 font-mono text-xs font-bold text-gray-900/70"
          style={{ left: `${10 + i * 24}%`, bottom: 4 }}
          animate={reduce ? { opacity: 0.5 } : { y: [6, -70], opacity: [0, 0.8, 0] }}
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
  const users = [
    { name: 'redsito', avatar: 3 },
    { name: 'aki_3x3', avatar: 9 },
    { name: 'mia', avatar: 5 }
  ]
  const categories = [
    { cat: '3×3', color: 'var(--cube-red)', times: [6.4, 5.87, 6.72] },
    { cat: '2×2', color: 'var(--cube-yellow)', times: [1.94, 2.31, 2.02] },
    { cat: 'OH', color: 'var(--cube-blue)', times: [12.41, 11.86, 13.1] },
    { cat: 'Pyraminx', color: 'var(--cube-green)', times: [3.55, 3.9, 3.18] }
  ]
  const fmt = (n: number) => n.toFixed(2)
  const COLS = 'grid grid-cols-[4.75rem_repeat(3,minmax(0,1fr))] items-center'

  return (
    <div className="flex flex-col">
      {/* Header: users are the columns */}
      <div className={`${COLS} border-b border-gray-900/8 pb-2`}>
        <span />
        {users.map((u) => (
          <span key={u.name} className="flex min-w-0 flex-col items-center gap-1">
            <Image
              src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${u.avatar}.png`}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full border-2 border-gray-900/10"
            />
            <span className="max-w-full truncate text-[10px] font-bold text-gray-800">{u.name}</span>
          </span>
        ))}
      </div>

      {/* Rows: categories, winner (fastest) gets the trophy */}
      <div className="mt-1.5 flex flex-col gap-1">
        {categories.map((row, i) => {
          const best = Math.min(...row.times)
          return (
            <motion.div
              key={row.cat}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`${COLS} notch-br [--nbr:8px] border border-gray-900/8 bg-white/70 py-2 pl-2.5 pr-1`}
            >
              <span className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-[3px]" style={{ backgroundColor: row.color }} />
                <span className="text-[11px] font-semibold text-gray-800">{row.cat}</span>
              </span>
              {row.times.map((tm, c) => {
                const isBest = tm === best
                return (
                  <span
                    key={c}
                    className={cn(
                      'flex items-center justify-center gap-1 font-mono text-xs tabular-nums',
                      isBest ? 'font-bold text-amber-500' : 'text-gray-500'
                    )}
                  >
                    {isBest && <Trophy className="size-3 shrink-0 fill-amber-500 text-amber-500" />}
                    {fmt(tm)}
                  </span>
                )
              })}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function AlgorithmsVisual() {
  const reduce = useReducedMotion()
  const sets = [
    { label: 'OLL', count: 57, active: true },
    { label: 'PLL', count: 21, active: false },
    { label: 'F2L', count: 41, active: false },
    { label: 'CMLL', count: 42, active: false }
  ]
  // Top-face sticker maps. All three cases already have the cross oriented, so
  // they differ only in which corners are yellow: one for Sune and Anti-Sune,
  // none for Pi, which leaves the bare cross.
  const cases = [
    {
      name: 'OLL 27',
      alias: 'Sune',
      face: [1, 1, 0, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
    },
    {
      name: 'OLL 26',
      alias: 'Anti-Sune',
      face: [0, 1, 1, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U2', "R'", "U'", 'R', "U'", "R'"]
    },
    {
      name: 'OLL 22',
      alias: 'Pi',
      face: [0, 1, 0, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U2', 'R2', "U'", 'R2', "U'", 'R2', 'U2', 'R']
    }
  ]

  return (
    <div className="flex flex-col">
      {/* set switcher */}
      <div className="flex items-center gap-4 border-b border-gray-900/8 pb-2">
        {sets.map((st) => (
          <span
            key={st.label}
            className={cn(
              'relative inline-flex items-center gap-1 pb-1.5 text-[10px] font-semibold',
              st.active ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            {st.label}
            <span
              className={cn(
                'inline-flex min-w-[14px] items-center justify-center rounded-full px-1 text-[8px] font-bold tabular-nums',
                st.active ? 'bg-[var(--cube-blue)]/15 text-[var(--cube-blue)]' : 'bg-gray-900/8 text-gray-400'
              )}
            >
              {st.count}
            </span>
            {st.active && (
              <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-full bg-[var(--cube-blue)]" />
            )}
          </span>
        ))}
      </div>

      {/* cases */}
      <div className="mt-3 flex flex-col gap-1.5">
        {cases.map((c, ci) => (
          <motion.div
            key={c.name}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 + ci * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 notch-br [--nbr:7px] border border-gray-900/8 bg-white/70 px-2 py-1.5"
          >
            <div className="grid shrink-0 grid-cols-3 gap-[3px]">
              {c.face.map((on, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + ci * 0.12 + i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  className="size-3 rounded-[2px]"
                  style={{ backgroundColor: on ? 'var(--cube-yellow)' : 'rgba(0,0,0,0.10)' }}
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.15em] text-gray-500">
                <span className="font-semibold text-gray-700">{c.name}</span> · {c.alias}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {c.moves.map((m, i) => (
                  <motion.span
                    key={i}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + ci * 0.12 + i * 0.05 }}
                    className="notch-br [--nbr:4px] bg-gray-900/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-800"
                  >
                    {m}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ProfileVisual() {
  const reduce = useReducedMotion()
  const tabs = [
    { label: 'Overview', count: 3, active: true },
    { label: 'Cubes', count: 5, active: false },
    { label: 'Timeline', count: 214, active: false },
    { label: 'Algorithms', count: 57, active: false }
  ]
  const rows = [
    { cat: '3×3', single: '5.87', ao5: '7.31', ao12: '8.02' },
    { cat: '2×2', single: '1.94', ao5: '2.63', ao12: '2.91' },
    { cat: 'Pyraminx', single: '2.40', ao5: '3.18', ao12: '3.55' }
  ]
  return (
    <div className="flex flex-col">
      {/* mini hero */}
      <div className="flex items-center gap-3 pb-3">
        <div className="relative shrink-0">
          <Image
            src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full shadow-md ring-2 ring-gray-900/10"
          />
          <span className="absolute -bottom-1 left-0 rounded-[3px] bg-[var(--cube-red)] px-1 text-[8px] font-black leading-tight text-white">
            LV.6
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-[var(--cube-green)]" />
        </div>
        <div className="min-w-0">
          <span className="inline-block notch-br [--nbr:4px] bg-gray-900 px-1.5 text-[8px] font-bold uppercase leading-tight text-white">
            sub-7
          </span>
          <p className="mt-0.5 text-base font-black leading-none tracking-tight text-gray-900">redsito</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] text-gray-500">
            <span>🇲🇽 Mexico</span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#000000]">
              <Image
                src="/timer-logos/wca.svg"
                alt="WCA"
                width={12}
                height={12}
                className="h-3 w-3 shrink-0 brightness-0"
                unoptimized
              />
              #2016REDS01
            </span>
            <span className="opacity-40">·</span>
            <span>Member since Jan 2024</span>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-4 border-b border-gray-900/8 pb-2">
        {tabs.map((tb) => (
          <span
            key={tb.label}
            className={cn(
              'relative inline-flex items-center gap-1 pb-1.5 text-[10px] font-semibold',
              tb.active ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            {tb.label}
            <span
              className={cn(
                'inline-flex min-w-[14px] items-center justify-center rounded-full px-1 text-[8px] font-bold tabular-nums',
                tb.active ? 'bg-[var(--cube-orange)]/15 text-[var(--cube-orange)]' : 'bg-gray-900/8 text-gray-400'
              )}
            >
              {tb.count}
            </span>
            {tb.active && (
              <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-full bg-[var(--cube-orange)]" />
            )}
          </span>
        ))}
      </div>

      {/* table */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] px-2 pb-0.5">
          <span />
          {['single', 'ao5', 'ao12'].map((h) => (
            <span key={h} className="text-right text-[8px] uppercase tracking-[0.15em] text-gray-400">
              {h}
            </span>
          ))}
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.cat}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] items-center notch-br [--nbr:7px] border border-gray-900/8 bg-white/70 px-2 py-1.5"
          >
            <span className="text-[11px] font-semibold text-gray-800">{r.cat}</span>
            <span className="text-right font-mono text-[11px] font-bold tabular-nums text-gray-900">{r.single}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-gray-500">{r.ao5}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-gray-500">{r.ao12}</span>
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
      time: undefined as string | undefined,
      color: 'var(--cube-blue)',
      d: 'M30 26 C 65 34, 100 26, 135 38 S 200 46, 246 52',
      end: { x: 246, y: 52 },
      bubble: { x: 176, y: 24, w: 62 },
      ink: '#ffffff',
      dash: '5 5',
      width: 2,
      opacity: 0.7,
      delay: 0.2,
      stacked: false
    },
    {
      label: 'Moyu Weilong GTS',
      value: '8.4',
      time: '8.42',
      color: 'var(--cube-orange)',
      d: 'M30 30 C 65 42, 100 32, 135 44 S 200 56, 246 64',
      end: { x: 246, y: 64 },
      bubble: { x: 28, y: 1, w: 104 },
      ink: '#4a2c00',
      dash: undefined,
      width: 2,
      opacity: 0.92,
      delay: 0.6,
      stacked: true
    },
    {
      label: 'GAN 356',
      value: '8.0',
      time: undefined as string | undefined,
      color: 'var(--cube-green)',
      d: 'M30 34 C 65 46, 100 34, 135 48 S 200 62, 246 76',
      end: { x: 246, y: 76 },
      bubble: { x: 160, y: 86, w: 82 },
      ink: '#10231a',
      dash: undefined,
      width: 2.5,
      opacity: 1,
      delay: 0.45,
      stacked: false
    }
  ]
  // solve-time histogram under the trend chart, bucketed 6s..12s
  const bins = [8, 16, 30, 48, 72, 96, 84, 60, 40, 26, 15, 9]
  const peak = bins.indexOf(Math.max(...bins))

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Ao100 trend</span>
        <span className="inline-flex items-center gap-1 notch-br [--nbr:4px] bg-[var(--cube-green)]/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--cube-green)]">
          <TrendingDown className="size-3" aria-hidden />
          1.42s
        </span>
      </div>

      <svg viewBox="0 0 260 110" className="h-32 w-full" aria-hidden>
        {[
          { y: 18, tick: '10.0' },
          { y: 48, tick: '9.0' },
          { y: 78, tick: '8.0' }
        ].map((g) => (
          <g key={g.y}>
            <line
              x1="26"
              y1={g.y}
              x2="260"
              y2={g.y}
              stroke="currentColor"
              className="text-gray-900/8"
              strokeWidth="1"
            />
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
              {s.stacked ? (
                <>
                  <rect
                    x={s.bubble.x}
                    y={s.bubble.y}
                    width={s.bubble.w}
                    height="26"
                    rx="7"
                    fill={s.color}
                    opacity={s.opacity}
                  />
                  <text
                    x={s.bubble.x + s.bubble.w / 2}
                    y={s.bubble.y + 12}
                    textAnchor="middle"
                    fill={s.ink}
                    fontWeight="800"
                    style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 10 }}
                  >
                    {s.time}
                  </text>
                  <text
                    x={s.bubble.x + s.bubble.w / 2}
                    y={s.bubble.y + 21.5}
                    textAnchor="middle"
                    fill={s.ink}
                    fontWeight="700"
                    style={{ fontFamily: 'var(--font-sans, ui-sans-serif, system-ui)', fontSize: 7 }}
                  >
                    {s.label}
                  </text>
                </>
              ) : (
                <>
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
                </>
              )}
            </motion.g>
          </g>
        ))}
      </svg>

      {/* solve distribution */}
      <div className="mt-3 border-t border-gray-900/8 pt-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[8px] uppercase tracking-[0.15em] text-gray-400">
          <span>Solve distribution</span>
          <span className="font-mono tracking-normal">2,481 solves</span>
        </div>
        <div className="flex h-9 items-end gap-[3px]">
          {bins.map((h, i) => (
            <motion.span
              key={i}
              initial={reduce ? { opacity: 0 } : { scaleY: 0 }}
              whileInView={reduce ? { opacity: 1 } : { scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 origin-bottom rounded-[2px]"
              style={{
                height: `${h}%`,
                backgroundColor: i === peak ? 'var(--cube-green)' : 'rgba(0,0,0,0.12)'
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[8px] text-gray-400">
          <span>6s</span>
          <span>12s</span>
        </div>
      </div>
    </div>
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
        'relative flex flex-col overflow-hidden notch-bl-tr [--nblt:20px] border border-gray-900/10 bg-gray-900/[0.03] p-6',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center notch-br [--nbr:7px]"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 15%, transparent)`,
            color: accent,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 25%, transparent)`
          }}
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
            icon={User}
            accent="var(--cube-orange)"
            title={t('profile-title')}
            desc={t('profile-desc')}
            visual={<ProfileVisual />}
            className="md:col-span-2"
            delay={0.05}
          />
          <BentoCard
            icon={BookOpen}
            accent="var(--cube-blue)"
            title={t('algs-title')}
            desc={t('algs-desc')}
            visual={<AlgorithmsVisual />}
            className="md:col-span-2"
            delay={0.1}
          />
          <BentoCard
            icon={LineChart}
            accent="var(--cube-green)"
            title={t('stats-title')}
            desc={t('stats-desc')}
            visual={<StatsVisual />}
            className="md:col-span-2"
            delay={0.15}
          />
        </div>
      </div>
    </section>
  )
}

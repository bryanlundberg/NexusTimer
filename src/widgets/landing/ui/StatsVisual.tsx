'use client'

import { motion, useReducedMotion } from 'motion/react'
import { TrendingDown } from 'lucide-react'

export default function StatsVisual() {
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

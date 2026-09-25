'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/shared/lib/utils'

export default function AlgorithmsVisual() {
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

'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export default function CompareVisual() {
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

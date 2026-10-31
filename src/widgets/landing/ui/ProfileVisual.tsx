'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Check, Copy, Link2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCycle } from '../model/useCycle'

export default function ProfileVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const copied = useCycle(2, 1800, inView) === 1
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
    <div ref={ref} className="flex flex-col">
      <div className="flex items-center gap-3 pb-3">
        <div className="relative shrink-0">
          <Image
            src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 ring-2 ring-border"
          />
          {!reduce && (
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 animate-ping bg-[var(--cube-green)] opacity-60" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 border-2 border-card bg-[var(--cube-green)]" />
        </div>
        <div className="min-w-0">
          <span className="inline-block bg-foreground px-1.5 text-[8px] font-bold uppercase leading-tight text-background">
            sub-7
          </span>
          <p className="mt-0.5 text-base font-black leading-none tracking-tight text-foreground">redsito</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] text-muted-foreground">
            <span>🇲🇽 Mexico</span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Image
                src="/timer-logos/wca.svg"
                alt="WCA"
                width={12}
                height={12}
                className="h-3 w-3 shrink-0 brightness-0 invert"
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
      <div className="flex items-center gap-4 border-b border-border pb-2">
        {tabs.map((tb) => (
          <span
            key={tb.label}
            className={cn(
              'relative inline-flex items-center gap-1 pb-1.5 text-[10px] font-semibold',
              tb.active ? 'text-foreground' : 'text-muted-foreground/70'
            )}
          >
            {tb.label}
            <span
              className={cn(
                'inline-flex min-w-[14px] items-center justify-center px-1 text-[8px] font-bold tabular-nums',
                tb.active
                  ? 'bg-[var(--cube-orange)]/15 text-[var(--cube-orange)]'
                  : 'bg-foreground/8 text-muted-foreground/70'
              )}
            >
              {tb.count}
            </span>
            {tb.active && <span className="absolute -bottom-[9px] left-0 h-0.5 w-full bg-[var(--cube-orange)]" />}
          </span>
        ))}
      </div>

      {/* table */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] px-2 pb-0.5">
          <span />
          {['single', 'ao5', 'ao12'].map((h) => (
            <span key={h} className="text-right text-[8px] uppercase tracking-[0.15em] text-muted-foreground/70">
              {h}
            </span>
          ))}
        </div>
        {rows.map((r, i) => (
          <m.div
            key={r.cat}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] items-center border border-border bg-card/70 px-2 py-1.5"
          >
            <span className="text-[11px] font-semibold text-foreground">{r.cat}</span>
            <span className="text-right font-mono text-[11px] font-bold tabular-nums text-foreground">{r.single}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">{r.ao5}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">{r.ao12}</span>
          </m.div>
        ))}
      </div>

      <div
        className={cn(
          'mt-3 flex items-center gap-2 border px-2 py-1.5 transition-colors duration-300',
          copied ? 'border-[var(--cube-green)]/50 bg-[var(--cube-green)]/8' : 'border-border'
        )}
      >
        <Link2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-foreground">nexustimer.com/redsito</span>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 px-1.5 py-0.5 font-mono text-[9px] font-bold transition-colors duration-300',
            copied ? 'bg-[var(--cube-green)] text-background' : 'bg-foreground/10 text-foreground'
          )}
        >
          {copied ? <Check className="size-3" strokeWidth={3} aria-hidden /> : <Copy className="size-3" aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </span>
      </div>
    </div>
  )
}

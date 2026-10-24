'use client'

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { cn } from '@/shared/lib/utils'

export default function BentoCard({
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
    <m.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('surface surface-panel flex flex-col overflow-hidden p-6', className)}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 15%, transparent)`,
            color: accent,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 25%, transparent)`
          }}
        >
          <Icon className="size-4" style={{ color: accent }} />
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mb-5 mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>

      <div className="mt-auto border-t border-border pt-5">{visual}</div>
    </m.div>
  )
}

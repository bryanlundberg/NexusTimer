'use client'

import { motion, useReducedMotion } from 'motion/react'
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

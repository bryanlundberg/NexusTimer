'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { INDICATOR_SPRING } from '@/shared/lib/motion'

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
  sublabel?: React.ReactNode
  icon?: React.ReactNode
}

interface SegmentedProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  layoutId: string
  'aria-label'?: string
  className?: string
}

export default function Segmented<T extends string>({
  value,
  onChange,
  options,
  layoutId,
  className,
  ...props
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={props['aria-label']}
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1 p-1 rounded-none border border-border/60 bg-background/60',
        className
      )}
    >
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 px-2.5 py-1.5 rounded-none text-xs font-semibold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-solve)] cursor-pointer',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-none bg-primary/15 ring-1 ring-primary/40 shadow-sm"
                transition={INDICATOR_SPRING}
              />
            )}
            {option.icon && (
              <motion.span
                className="relative inline-flex shrink-0"
                animate={{ opacity: active ? 1 : 0.6, rotate: active ? [0, -8, 8, 0] : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {option.icon}
              </motion.span>
            )}
            {option.sublabel ? (
              <span className="relative flex flex-col items-start leading-tight">
                <span>{option.label}</span>
                <span className="text-[9px] font-medium uppercase tracking-wider opacity-70">{option.sublabel}</span>
              </span>
            ) : (
              <span className="relative">{option.label}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

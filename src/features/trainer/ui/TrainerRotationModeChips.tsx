'use client'

import type * as React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Shuffle, Dice5, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { INDICATOR_SPRING } from '@/shared/lib/motion'
import type { TrainerRotationMode } from '@/features/trainer/model/types'

interface TrainerRotationModeChipsProps {
  value: TrainerRotationMode
  onChange: (mode: TrainerRotationMode) => void
}

const OPTIONS: Array<{ id: TrainerRotationMode; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'shuffle', icon: Shuffle },
  { id: 'random', icon: Dice5 },
  { id: 'sequential', icon: ArrowRight }
]

export default function TrainerRotationModeChips({ value, onChange }: TrainerRotationModeChipsProps) {
  const t = useTranslations('Index.TrainerPage.rotation')
  return (
    <div className="relative inline-flex h-auto items-center rounded-xl bg-muted/60 p-1 ms-auto">
      {OPTIONS.map(({ id, icon: Icon }) => {
        const active = id === value
        const label = t(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'relative z-10 inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-lg font-medium transition-colors cursor-pointer',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={active}
            title={label}
          >
            {active && (
              <motion.span
                layoutId="trainer-rotation-mode-indicator"
                className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-border/70"
                transition={INDICATOR_SPRING}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

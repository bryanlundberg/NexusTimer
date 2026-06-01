'use client'

import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { PuzzleOption } from '@/features/leaderboards/model/puzzle-options'

interface PuzzleSwitchTabProps {
  option: PuzzleOption
  active: boolean
  layoutId: string
  onSelect: (value: string) => void
}

export default function PuzzleSwitchTab({ option, active, layoutId, onSelect }: PuzzleSwitchTabProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={active}
      className={cn(
        'relative flex shrink-0 items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-md bg-primary/10 ring-1 ring-primary/30 shadow-sm"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <motion.img
        src={option.src}
        alt={option.label}
        animate={{ opacity: active ? 1 : 0.6, rotate: active ? [0, -8, 8, 0] : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative size-6 shrink-0"
      />
      <span className="relative flex flex-col items-start leading-tight">
        <span className="font-mono">{option.label}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-70">{option.mode}</span>
      </span>
    </button>
  )
}

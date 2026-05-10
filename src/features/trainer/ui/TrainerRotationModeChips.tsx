'use client'

import { Shuffle, Dice5, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { TrainerRotationMode } from '@/features/trainer/model/types'

interface TrainerRotationModeChipsProps {
  value: TrainerRotationMode
  onChange: (mode: TrainerRotationMode) => void
}

const OPTIONS: Array<{ id: TrainerRotationMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'shuffle', label: 'Shuffle', icon: Shuffle },
  { id: 'random', label: 'Random', icon: Dice5 },
  { id: 'sequential', label: 'Sequential', icon: ArrowRight }
]

export default function TrainerRotationModeChips({ value, onChange }: TrainerRotationModeChipsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 h-8 text-xs transition-colors',
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
            aria-pressed={active}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

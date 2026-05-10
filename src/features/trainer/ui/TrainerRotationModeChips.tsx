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
    <div className="inline-flex items-center rounded-md border bg-background p-0.5">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex items-center gap-1 h-7 px-2.5 text-xs rounded-sm transition-colors cursor-pointer',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
            aria-pressed={active}
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

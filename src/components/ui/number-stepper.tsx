'use client'

import * as React from 'react'
import { MinusIcon, PlusIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface NumberStepperProps {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step?: number
  scale?: number
  unit?: string
  decrementLabel: string
  incrementLabel: string
  id?: string
  'aria-label'?: string
  className?: string
}

function NumberStepper({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  scale = 1,
  unit,
  decrementLabel,
  incrementLabel,
  id,
  'aria-label': ariaLabel,
  className
}: NumberStepperProps) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const current = Number.isFinite(value) ? value : min
  const shown = draft ?? String(current / scale)

  const commit = (next: number) => {
    const snapped = Math.round((next - min) / step) * step + min
    const clamped = Math.min(max, Math.max(min, snapped))
    if (clamped !== current) onValueChange(clamped)
  }

  const draftValue = () => {
    if (draft === null || draft.trim() === '') return null
    const parsed = Number(draft)
    return Number.isFinite(parsed) ? parsed * scale : null
  }

  const commitDraft = () => {
    const parsed = draftValue()
    setDraft(null)
    if (parsed !== null) commit(parsed)
  }

  const nudge = (direction: 1 | -1) => {
    const base = draftValue() ?? current
    setDraft(null)
    commit(base + direction * step)
  }

  const buttonClassName =
    'relative z-[1] flex w-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:text-foreground focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring active:text-primary disabled:pointer-events-none disabled:opacity-30 sm:w-9 [&_svg]:size-4 [&_svg]:transition-transform active:[&_svg]:scale-75'

  return (
    <div data-slot="number-stepper" className={cn('field-notch flex h-11 w-40 shrink-0 sm:h-9 sm:w-36', className)}>
      <button
        type="button"
        aria-label={decrementLabel}
        disabled={current <= min}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => nudge(-1)}
        className={buttonClassName}
      >
        <MinusIcon />
      </button>
      <label className="relative z-[1] flex min-w-0 flex-1 cursor-text items-center justify-center gap-1">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          enterKeyHint="done"
          autoComplete="off"
          aria-label={ariaLabel}
          value={shown}
          style={{ width: `${Math.max(shown.length, 1) + 0.5}ch` }}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') {
              setDraft(null)
              e.currentTarget.blur()
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault()
              nudge(e.key === 'ArrowUp' ? 1 : -1)
            }
          }}
          className="min-w-0 bg-transparent text-center font-mono text-base tabular-nums outline-none sm:text-sm"
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </label>
      <button
        type="button"
        aria-label={incrementLabel}
        disabled={current >= max}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => nudge(1)}
        className={buttonClassName}
      >
        <PlusIcon />
      </button>
    </div>
  )
}

export { NumberStepper }

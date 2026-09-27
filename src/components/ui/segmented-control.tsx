'use client'

import * as React from 'react'

import { cn } from '@/shared/lib/utils'

interface SegmentedControlProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: React.ReactNode }>
  className?: string
  'aria-label'?: string
}

const INDICATOR_SHAPE = '[clip-path:polygon(0_0,calc(100%_-_5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%_-_5px))]'

function SegmentedControl({
  value,
  onValueChange,
  options,
  className,
  'aria-label': ariaLabel
}: SegmentedControlProps) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = options.findIndex((option) => option.value === value)

  const select = (index: number) => {
    const option = options[(index + options.length) % options.length]
    onValueChange(option.value)
    refs.current[(index + options.length) % options.length]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      data-slot="segmented-control"
      className={cn('field-notch flex h-11 shrink-0 p-[3px] sm:h-9', className)}
    >
      <div className="relative z-[1] flex flex-1">
        {selectedIndex >= 0 && (
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-0 left-0 bg-primary/20 shadow-[inset_0_-2px_0_var(--primary)] transition-transform duration-200 ease-(--ease-solve)',
              INDICATOR_SHAPE
            )}
            style={{ width: `${100 / options.length}%`, transform: `translateX(${selectedIndex * 100}%)` }}
          />
        )}
        {options.map((option, index) => {
          const selected = index === selectedIndex
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (selectedIndex < 0 && index === 0) ? 0 : -1}
              onClick={() => onValueChange(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  select(index + 1)
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  select(index - 1)
                }
              }}
              className={cn(
                'relative flex min-w-11 flex-1 cursor-pointer items-center justify-center px-3 text-sm tabular-nums text-muted-foreground outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:text-foreground focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring',
                selected && 'font-medium text-foreground'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SegmentedControl }

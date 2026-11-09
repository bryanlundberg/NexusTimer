import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'

export interface ChipOption<T extends string> {
  value: T
  label: ReactNode
}

interface ChipGroupProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ChipOption<T>[]
  label: string
  className?: string
}

export default function ChipGroup<T extends string>({ value, onChange, options, label, className }: ChipGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <Badge
            key={option.value}
            asChild
            variant={active ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer select-none gap-1.5 px-2 py-1 text-xs transition-colors pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-[13px]',
              active ? 'hover:bg-primary/90' : 'hover:border-primary/40 hover:bg-primary/10'
            )}
          >
            <button type="button" role="radio" aria-checked={active} onClick={() => onChange(option.value)}>
              {option.label}
            </button>
          </Badge>
        )
      })}
    </div>
  )
}

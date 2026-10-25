import * as React from 'react'
import { cn } from '@/shared/lib/utils'

type TileTone = 'default' | 'record' | 'danger'

interface PageAsideTileProps {
  label: React.ReactNode
  value: React.ReactNode
  tone?: TileTone
  footer?: React.ReactNode
  className?: string
}

const toneClasses: Record<TileTone, { box: string; value: string }> = {
  default: { box: 'bg-foreground/[0.04]', value: 'text-foreground' },
  record: { box: 'bg-record/10', value: 'text-record' },
  danger: { box: 'bg-destructive/10', value: 'text-destructive' }
}

export function PageAsideTile({ label, value, tone = 'default', footer, className }: PageAsideTileProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5 px-2 py-1.5', toneClasses[tone].box, className)}>
      <span className="truncate font-display text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className={cn('truncate text-sm font-semibold tabular-nums leading-tight', toneClasses[tone].value)}>
        {value}
      </span>
      {footer}
    </div>
  )
}

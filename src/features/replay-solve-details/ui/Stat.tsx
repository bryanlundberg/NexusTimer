import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export function Stat({
  label,
  value,
  icon,
  className
}: {
  label: string
  value: string | number
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-1 bg-muted/40 py-2.5', className)}>
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

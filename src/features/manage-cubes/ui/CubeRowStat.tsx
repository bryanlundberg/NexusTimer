import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface CubeRowStatProps {
  label: string
  children: ReactNode
  className?: string
}

export function CubeRowStat({ label, children, className }: CubeRowStatProps) {
  return (
    <div className={cn('min-w-0 flex-col items-end gap-0.5', className)}>
      <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</span>
      <span className="flex items-baseline gap-1.5 whitespace-nowrap">{children}</span>
    </div>
  )
}

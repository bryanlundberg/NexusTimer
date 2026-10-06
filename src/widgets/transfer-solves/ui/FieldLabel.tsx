import type { ReactNode } from 'react'

interface FieldLabelProps {
  color: string
  children: ReactNode
}

export default function FieldLabel({ color, children }: FieldLabelProps) {
  return (
    <span className="flex items-center gap-2 px-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  )
}

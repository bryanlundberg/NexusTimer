import type { ReactNode } from 'react'

export function Stat({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="surface surface-well surface-sm flex flex-col items-center gap-1 py-2.5">
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

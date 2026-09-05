'use client'

import type { LucideIcon } from 'lucide-react'

interface TrainerStatCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
}

export default function TrainerStatCard({ icon: Icon, label, value, sub }: TrainerStatCardProps) {
  return (
    <div className="algo-panel-notch [--ap-notch:10px] flex flex-col gap-1 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="text-xl font-semibold tabular-nums leading-none">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground tabular-nums">{sub}</span>}
    </div>
  )
}

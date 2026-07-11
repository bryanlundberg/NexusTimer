'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface TrainerStatCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  accent: string
}

export default function TrainerStatCard({ icon: Icon, label, value, sub, accent }: TrainerStatCardProps) {
  return (
    <div className={cn('flex flex-col gap-1 border-l-2 pl-3 py-0.5', accent)}>
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="text-xl font-semibold tabular-nums leading-none">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground tabular-nums">{sub}</span>}
    </div>
  )
}

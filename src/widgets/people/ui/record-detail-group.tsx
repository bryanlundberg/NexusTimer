import type * as React from 'react'

interface RecordDetailGroupProps {
  title: string
  value: string
  extra?: React.ReactNode
  children: React.ReactNode
}

export function RecordDetailGroup({ title, value, extra, children }: RecordDetailGroupProps) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <span className="text-xs font-bold tabular-nums">{value}</span>
        {extra}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{children}</div>
    </div>
  )
}

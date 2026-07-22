import * as React from 'react'

interface InformationProps {
  className?: string
  title: string
  description?: string
  algorithmCount?: number
  actions?: React.ReactNode
}

export default function Information({ title, description, algorithmCount, actions }: InformationProps) {
  return (
    <div className="mb-6 border-b pb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {algorithmCount !== undefined && (
          <div className="hidden size-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-none border bg-card text-center sm:flex">
            <span className="text-lg font-bold leading-none tabular-nums">{algorithmCount}</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Algs</span>
          </div>
        )}
      </div>
      {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

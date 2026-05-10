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
    <div className="mb-6 rounded-xl border border-primary/10 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {algorithmCount !== undefined && (
          <div className="hidden shrink-0 flex-col items-center rounded-lg bg-primary/10 px-3 py-1.5 sm:flex">
            <span className="text-lg font-bold text-primary leading-none">{algorithmCount}</span>
            <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">Algs</span>
          </div>
        )}
      </div>
      {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

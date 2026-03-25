import * as React from 'react'

interface InformationProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title: string
  description?: string
  algorithmCount?: number
}

export default function Information({ title, description, algorithmCount }: InformationProps) {
  return (
    <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/8 via-primary/4 to-transparent border border-primary/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>}
        </div>
        {algorithmCount !== undefined && (
          <div className="flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2 shrink-0">
            <span className="text-xl font-bold text-primary">{algorithmCount}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Algs</span>
          </div>
        )}
      </div>
    </div>
  )
}

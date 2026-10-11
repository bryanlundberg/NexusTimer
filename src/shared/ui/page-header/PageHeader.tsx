import * as React from 'react'
import { cn } from '@/shared/lib/utils'

interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, meta, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-2xl leading-tight font-bold tracking-tight text-balance md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

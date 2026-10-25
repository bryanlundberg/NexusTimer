import * as React from 'react'
import { cn } from '@/shared/lib/utils'

interface PageAsideRowProps {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  valueClassName?: string
  onClick?: () => void
}

export function PageAsideRow({ label, value, hint, valueClassName, onClick }: PageAsideRowProps) {
  const content = (
    <>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm text-foreground">{label}</span>
        {hint && <span className="truncate text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span className={cn('shrink-0 font-mono text-sm font-medium tabular-nums text-foreground', valueClassName)}>
        {value}
      </span>
    </>
  )

  const className = 'flex w-full items-center justify-between gap-4 py-2'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(className, '-mx-2 w-[calc(100%+1rem)] cursor-pointer px-2 text-left hover:bg-accent/50')}
      >
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

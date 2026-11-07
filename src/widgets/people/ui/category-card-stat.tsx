import type * as React from 'react'

interface CategoryCardStatProps {
  label: string
  children: React.ReactNode
  caption?: (string | null | undefined)[]
}

export function CategoryCardStat({ label, children, caption }: CategoryCardStatProps) {
  const lines = caption?.filter(Boolean) ?? []

  return (
    <span className="flex min-w-0 flex-col gap-1">
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
      {lines.length > 0 && (
        <span className="flex min-w-0 flex-col text-[11px] leading-snug text-muted-foreground">
          {lines.map((line, i) => (
            <span key={i} className="truncate tabular-nums" title={line ?? undefined}>
              {line}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}

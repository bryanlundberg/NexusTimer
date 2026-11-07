import type * as React from 'react'

interface CategoryCardStatProps {
  label: string
  children: React.ReactNode
  caption?: (string | null | undefined)[]
  note?: string
}

export function CategoryCardStat({ label, children, caption, note }: CategoryCardStatProps) {
  const lines = caption?.filter(Boolean) ?? []

  return (
    <span className="flex min-w-0 flex-col gap-1">
      <span
        title={label}
        className="truncate font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
        {note && <span className="font-sans font-medium tracking-normal opacity-70"> · {note}</span>}
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

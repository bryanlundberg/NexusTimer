import React from 'react'
import { cn } from '@/shared/lib/utils'
import { LABEL_COLUMN } from '@/features/compare-users/model/columns'

export default function CompareTableRow({
  title,
  children,
  className,
  isHeader
}: {
  title?: string
  children: React.ReactNode
  className?: string
  isHeader?: boolean
}) {
  return (
    <div
      className={cn(
        'flex gap-3 w-max items-center',
        isHeader
          ? 'sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md shadow-sm'
          : 'border-b border-border/40',
        className
      )}
    >
      {isHeader ? (
        <div aria-hidden className={cn(LABEL_COLUMN, 'shrink-0')} />
      ) : (
        <div
          className={cn(
            LABEL_COLUMN,
            'py-4 text-[13px] sm:text-sm sticky left-0 z-40 px-3 sm:px-4 flex justify-end text-right font-medium text-muted-foreground bg-background shadow-[1px_0_0_var(--border)]'
          )}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

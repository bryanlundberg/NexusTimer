import React from 'react'
import { cn } from '@/shared/lib/utils'

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
      <div
        className={cn(
          'w-32 py-4 text-sm sticky left-0 z-40 px-4 flex justify-end text-right font-medium text-muted-foreground bg-background',
          isHeader && 'text-foreground font-bold'
        )}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

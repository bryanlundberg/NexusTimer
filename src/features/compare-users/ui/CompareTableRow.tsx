import React from 'react'
import { Badge } from '@/components/ui/badge'
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
        'flex gap-3 w-max items-center transition-colors hover:bg-muted/30 group',
        isHeader ? 'sticky top-0 backdrop-blur-sm z-50 border-b shadow-sm' : 'border-b border-border/40',
        className
      )}
    >
      <div
        className={cn(
          'w-40 py-4 text-sm sticky left-0 z-40 px-4 flex justify-end font-medium text-muted-foreground group-hover:text-foreground transition-colors',
          isHeader && 'text-foreground font-bold'
        )}
      >
        {title && (
          <Badge variant={'outline'} className={'rounded-md bg-muted/50 whitespace-nowrap'}>
            {title}
          </Badge>
        )}
      </div>
      {children}
    </div>
  )
}

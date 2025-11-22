import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function CompareTableRow({
  title,
  children,
  className
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex gap-3 w-max items-center', className)}>
      <div className={'w-40 py-3 text-sm sticky left-0 z-40 bg-background px-4 flex justify-end'}>
        {title && (
          <Badge variant={'outline'} className={'rounded-md'}>
            {title}
          </Badge>
        )}
      </div>
      {children}
    </div>
  )
}

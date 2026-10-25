import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export function PageAside({ className, children, ...rest }: React.ComponentProps<'aside'>) {
  return (
    <aside
      className={cn(
        'hidden xl:flex w-64 shrink-0 min-h-0 flex-col overflow-y-auto scrollbar-hide border-s border-border bg-background/60 backdrop-blur-md px-4 pb-6',
        className
      )}
      {...rest}
    >
      {children}
    </aside>
  )
}

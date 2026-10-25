import * as React from 'react'
import { cn } from '@/shared/lib/utils'

interface PageAsideSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: React.ReactNode
  aside?: React.ReactNode
}

export function PageAsideSection({ title, aside, className, children, ...rest }: PageAsideSectionProps) {
  return (
    <section className={cn('shrink-0 border-b border-border py-6 last:border-b-0', className)} {...rest}>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

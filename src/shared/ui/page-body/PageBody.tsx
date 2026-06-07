import * as React from 'react'
import { cn } from '@/shared/lib/utils'

type PageBodyVariant = 'data' | 'hero'

interface PageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PageBodyVariant
}

const variantClasses: Record<PageBodyVariant, string> = {
  data: 'pt-3',
  hero: 'pt-8'
}

export function PageBody({ variant = 'data', className, children, ...rest }: PageBodyProps) {
  return (
    <div className={cn(variantClasses[variant], className)} {...rest}>
      {children}
    </div>
  )
}

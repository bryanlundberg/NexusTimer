import React from 'react'
import { cn } from '@/shared/lib/utils'

export function NexiGridBackdrop({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-70 dark:opacity-50',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(to right, color-mix(in oklch, var(--muted-foreground) 22%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--muted-foreground) 22%, transparent) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 0%, black 10%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 10%, transparent 78%)'
      }}
      {...rest}
    />
  )
}

export default NexiGridBackdrop

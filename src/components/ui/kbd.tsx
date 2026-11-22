import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center border border-current/30 bg-current/10 px-1 font-mono text-[10px] leading-none font-medium pointer-coarse:hidden',
        className
      )}
      {...props}
    />
  )
}

import { type CubingMethod, METHOD_SPECS } from '@/shared/const/cubing-methods'
import { cn } from '@/shared/lib/utils'

const NOTCH = 'polygon(0 0, 88% 0, 100% 30%, 100% 100%, 12% 100%, 0 70%)'

interface MethodGlyphProps {
  method?: CubingMethod | null
  className?: string
}

export function MethodGlyph({ method, className }: MethodGlyphProps) {
  const phases = method ? METHOD_SPECS[method].phases : ['bg-muted-foreground/25']

  return (
    <span
      aria-hidden
      className={cn('inline-flex h-2.5 w-6 shrink-0 gap-px bg-foreground/10', className)}
      style={{ clipPath: NOTCH }}
    >
      {phases.map((bg, i) => (
        <span
          key={`${method ?? 'none'}-${i}`}
          className={cn(
            'h-full flex-1 origin-left [animation:lp-grow_320ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none',
            bg
          )}
          style={{ animationDelay: `${i * 45}ms` }}
        />
      ))}
    </span>
  )
}

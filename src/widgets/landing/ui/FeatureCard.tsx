import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export default function FeatureCard({
  title,
  desc,
  visual,
  highlight = false,
  wide = false,
  className
}: {
  title: string
  desc: string
  visual: ReactNode
  highlight?: boolean
  wide?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 p-6 md:p-8',
        wide && 'md:flex-row md:items-center md:gap-12',
        highlight ? 'lp-panel' : 'bg-background',
        className
      )}
    >
      <div className={cn(wide && 'md:flex-1')}>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-medium tracking-[-0.02em] md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{desc}</p>
      </div>
      <div
        className={cn(
          'mt-auto overflow-hidden text-foreground',
          wide && 'md:mt-0 md:flex-1',
          !highlight && !wide && 'lp-window border border-border bg-background p-4',
          wide && 'p-3'
        )}
      >
        {visual}
      </div>
    </div>
  )
}

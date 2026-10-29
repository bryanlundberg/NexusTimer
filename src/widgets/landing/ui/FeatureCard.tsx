import type { ElementType, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export default function FeatureCard({
  icon: Icon,
  title,
  desc,
  visual,
  highlight = false,
  className
}: {
  icon: ElementType
  title: string
  desc: string
  visual: ReactNode
  highlight?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-8 p-6 md:p-8', highlight ? 'lp-panel' : 'bg-background', className)}>
      <div className="lp-window overflow-hidden rounded-[10px] border border-border bg-background p-4 text-foreground">
        {visual}
      </div>
      <div className="mt-auto">
        <Icon className="size-5" aria-hidden />
        <h3 className="mt-4 text-base font-medium">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>
      </div>
    </div>
  )
}

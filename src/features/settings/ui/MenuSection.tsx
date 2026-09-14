import { cn } from '@/shared/lib/utils'

interface MenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  icon: React.ReactNode
  title: string
  accent?: string
  className?: string
}

export function MenuSection({ children, icon, title, accent, className, ...rest }: MenuSectionProps) {
  return (
    <section {...rest} className={cn('scroll-mt-16', className)}>
      <div className="flex items-center gap-2 px-1 pb-2">
        <span className={cn('size-2 shrink-0 rounded-[2px]', accent ?? 'bg-primary/60')} aria-hidden />
        <div className="text-muted-foreground [&>svg]:size-4">{icon}</div>
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
          {title}
        </span>
        <span aria-hidden className="h-px min-w-4 flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="divide-y divide-border/40 border border-border/60 bg-card/40">{children}</div>
    </section>
  )
}

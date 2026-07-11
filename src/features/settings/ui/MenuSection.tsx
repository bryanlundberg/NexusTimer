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
      <div className="flex items-center gap-2.5 px-3 pb-1.5">
        <span className={cn('h-4 w-1 rounded-full', accent ?? 'bg-primary/60')} aria-hidden />
        <div className="text-muted-foreground [&>svg]:size-4">{icon}</div>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{title}</span>
      </div>
      <div className="mt-1">{children}</div>
    </section>
  )
}

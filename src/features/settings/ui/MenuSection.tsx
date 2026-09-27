import { cn } from '@/shared/lib/utils'

interface MenuSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  title: string
  className?: string
  tone?: 'default' | 'destructive'
  footer?: string
}

export function MenuSection({ children, title, className, tone = 'default', footer, ...rest }: MenuSectionProps) {
  return (
    <section {...rest} className={cn('scroll-mt-16', className)}>
      <h2
        className={cn(
          'px-4 pb-2 text-[13px] font-medium',
          tone === 'destructive' ? 'text-destructive' : 'text-muted-foreground'
        )}
      >
        {title}
      </h2>
      <div
        style={
          tone === 'destructive'
            ? ({
                '--pn-border-color': 'color-mix(in oklab, var(--destructive) 40%, var(--border))'
              } as React.CSSProperties)
            : undefined
        }
        className="panel-notch-bl-tr [&>*+*]:relative [&>*+*]:before:pointer-events-none [&>*+*]:before:absolute [&>*+*]:before:top-0 [&>*+*]:before:right-0 [&>*+*]:before:left-4 [&>*+*]:before:h-px [&>*+*]:before:bg-border/60 [&>*+*]:before:content-['']"
      >
        {children}
      </div>
      {footer && <p className="px-4 pt-2 text-[13px] leading-snug text-muted-foreground sm:text-xs">{footer}</p>}
    </section>
  )
}

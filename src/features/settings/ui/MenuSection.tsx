import { cn } from '@/shared/lib/utils'

interface MenuSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  title: string
  className?: string
  tone?: 'default' | 'destructive'
  footer?: string
  separators?: boolean
}

const SEPARATORS =
  "[&>*+*]:relative [&>*+*]:before:pointer-events-none [&>*+*]:before:absolute [&>*+*]:before:top-0 [&>*+*]:before:right-0 [&>*+*]:before:left-4 [&>*+*]:before:h-px [&>*+*]:before:bg-border/60 [&>*+*]:before:content-['']"

export function MenuSection({
  children,
  title,
  className,
  tone = 'default',
  footer,
  separators = true,
  id,
  ...rest
}: MenuSectionProps) {
  const titleId = id ? `${id}-title` : undefined

  return (
    <section {...rest} id={id} aria-labelledby={titleId} className={cn('scroll-mt-16', className)}>
      <h2
        id={titleId}
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
        className={cn('panel-notch-bl-tr', separators && SEPARATORS)}
      >
        {children}
      </div>
      {footer && <p className="px-4 pt-2 text-[13px] leading-snug text-muted-foreground sm:text-xs">{footer}</p>}
    </section>
  )
}

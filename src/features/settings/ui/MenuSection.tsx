import { cn } from '@/shared/lib/utils'

interface MenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  icon: React.ReactNode
  title: string
  className?: string
}

export function MenuSection({ children, icon, title, className, ...rest }: MenuSectionProps) {
  return (
    <>
      <div
        {...rest}
        className={cn(
          'flex items-center gap-2.5 font-medium sticky bg-background/95 backdrop-blur-lg top-0 py-2.5 z-10 px-3',
          className
        )}
      >
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm tracking-wide uppercase text-muted-foreground">{title}</span>
      </div>
      <div className="py-1">{children}</div>
    </>
  )
}

import { cn } from '@/shared/lib/utils'

interface MenuRowProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function MenuRow({ label, description, children, className }: MenuRowProps) {
  return (
    <div className={cn('px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/30', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{label}</span>
          {description && <span className="text-xs text-muted-foreground leading-snug">{description}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}

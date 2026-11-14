import { SheetClose } from '@/components/ui/sheet'
import { cn } from '@/shared/lib/utils'
import type { NavUserItemProps } from '@/widgets/sidebar/ui/nav-user-item'

export function NavUserSheetItem({ className, variant = 'default', children, ...props }: NavUserItemProps) {
  return (
    <SheetClose asChild>
      <button
        type="button"
        className={cn(
          "flex min-h-12 w-full items-center gap-2 text-left text-base outline-hidden transition-colors select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground",
          variant === 'destructive'
            ? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10 active:bg-destructive/10'
            : 'hover:bg-accent focus-visible:bg-accent active:bg-accent',
          className
        )}
        {...props}
      >
        {children}
      </button>
    </SheetClose>
  )
}

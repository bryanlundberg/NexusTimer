import { cn } from '@/shared/lib/utils'

export const dockIconButtonClass =
  'flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring'

/**
 * Mouse clicks must not leave focus on dock controls: the timer runs on the space bar,
 * which would press the focused button again. Keyboard users can still tab to them.
 */
export const keepFocusOnMouseDown = (event: React.MouseEvent) => event.preventDefault()

export function DockIconButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      onMouseDown={keepFocusOnMouseDown}
      className={cn(dockIconButtonClass, className)}
      {...props}
    />
  )
}

import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export function FieldClearButton({
  label,
  onClear,
  className
}: {
  label: string
  onClear: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClear}
      className={cn(
        'absolute right-9 top-1/2 z-[2] grid size-6 -translate-y-1/2 place-items-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 animate-in fade-in zoom-in-75 duration-150',
        className
      )}
    >
      <X className="size-3.5" />
    </button>
  )
}

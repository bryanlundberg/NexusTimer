import { Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface LearnedToggleProps {
  learned?: boolean
  onClick: () => void
  className?: string
}

export default function LearnedToggle({ learned, onClick, className }: LearnedToggleProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      haptic
      aria-pressed={learned}
      aria-label={learned ? 'Marked as learned' : 'Mark as learned'}
      title={learned ? 'Marked as learned — click to unmark' : 'Mark as learned'}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'h-7 gap-1.5 px-2 text-xs font-medium',
        learned
          ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
          : 'text-muted-foreground',
        className
      )}
    >
      {learned ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
      <span className="hidden sm:inline">{learned ? 'Learned' : 'Mark learned'}</span>
    </Button>
  )
}

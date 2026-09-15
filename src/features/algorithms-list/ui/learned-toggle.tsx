import { Check, Circle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface LearnedToggleProps {
  learned?: boolean
  onClick: () => void
  className?: string
}

export default function LearnedToggle({ learned, onClick, className }: LearnedToggleProps) {
  const t = useTranslations('Index.AlgorithmsPage.learned-toggle')
  const label = learned ? t('learned') : t('mark')

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      haptic
      aria-pressed={learned}
      aria-label={label}
      title={label}
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
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}

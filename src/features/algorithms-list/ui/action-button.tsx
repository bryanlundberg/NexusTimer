import { type ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface ActionButtonProps {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  active?: boolean
}

export default function ActionButton({ icon: Icon, label, onClick, active }: ActionButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? 'outline' : 'default'}
      size="sm"
      haptic
      className={cn('btn-notch h-7 gap-1.5 px-2 text-xs font-medium', active && 'border-primary/40 text-primary')}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
      title={label}
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}

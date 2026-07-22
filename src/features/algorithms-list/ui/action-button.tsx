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
      variant="ghost"
      size="icon"
      className={cn('btn-notch size-7', active ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
      title={label}
    >
      <Icon className="size-3.5" />
    </Button>
  )
}

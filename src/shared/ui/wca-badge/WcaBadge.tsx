import { cn } from '@/shared/lib/utils'

interface WcaBadgeProps {
  wcaId: string
  showCode?: boolean
  className?: string
  iconClassName?: string
}

export function WcaBadge({ wcaId, showCode = false, className, iconClassName }: WcaBadgeProps) {
  return (
    <a
      href={`https://www.worldcubeassociation.org/persons/${wcaId}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={`WCA: ${wcaId}`}
      className={cn(
        'inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
    >
      <img src="/timer-logos/wca.svg" alt="WCA" className={cn('size-4 shrink-0', iconClassName)} />
      {showCode && <span className="text-sm font-medium">(#{wcaId})</span>}
    </a>
  )
}

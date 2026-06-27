import { cn } from '@/shared/lib/utils'

export function FilterRow({
  label,
  count,
  colorClass,
  active,
  onClick
}: {
  label: string
  count: number
  colorClass?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
        active ? 'bg-primary/10 font-medium' : 'hover:bg-muted'
      )}
    >
      <span className={cn('size-2 shrink-0 rounded-full', colorClass ?? 'bg-muted-foreground')} />
      <span className="flex-1 truncate">{label}</span>
      <span className="text-xs text-muted-foreground">{count}</span>
    </button>
  )
}

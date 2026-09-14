import { cn } from '@/shared/lib/utils'

export function TimeDisplay({ value, isRecord = false }: { value: string; isRecord?: boolean }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      <span className={cn('text-sm font-bold tabular-nums', isRecord && 'text-amber-700 dark:text-amber-400')}>
        {main}
      </span>
      {decimal && (
        <span
          className={cn(
            'text-xs tabular-nums',
            isRecord ? 'text-amber-700/70 dark:text-amber-400/70' : 'text-muted-foreground'
          )}
        >
          .{decimal}
        </span>
      )}
    </div>
  )
}

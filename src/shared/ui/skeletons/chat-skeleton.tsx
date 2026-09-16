import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

const NAME_WIDTHS = ['w-28', 'w-20', 'w-32', 'w-24', 'w-36', 'w-24']
const PREVIEW_WIDTHS = ['w-44', 'w-32', 'w-52', 'w-36', 'w-28', 'w-48']

export function InboxListSkeleton({ rows = 6, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <div aria-hidden className="flex flex-col">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center gap-3 border-b border-b-border/40 px-3',
            compact ? 'py-2.5 last:border-b-0' : 'border-l-2 border-l-transparent py-3'
          )}
        >
          <Skeleton className="size-10 shrink-0 rounded-lg" />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <Skeleton className={cn('h-3.5', NAME_WIDTHS[i % NAME_WIDTHS.length])} />
              <Skeleton className="h-2.5 w-7 shrink-0" />
            </div>
            <Skeleton className={cn('h-3 max-w-full', PREVIEW_WIDTHS[i % PREVIEW_WIDTHS.length])} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ConversationPeerSkeleton() {
  return (
    <span aria-hidden className="flex min-w-0 items-center gap-2.5">
      <Skeleton className="size-9 shrink-0 rounded-lg" />
      <span className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-16" />
      </span>
    </span>
  )
}

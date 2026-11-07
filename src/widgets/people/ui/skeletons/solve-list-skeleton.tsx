import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export function SolveListSkeleton({ className }: { className?: string } = {}) {
  return (
    <div className={cn('border border-border/60 bg-card/40', className)}>
      {[3, 4].map((rows, group) => (
        <div key={group} className="border-b border-border/60 last:border-b-0">
          <div className="border-b border-border/40 bg-muted/30 px-3 py-2.5">
            <Skeleton className="h-2.5 w-20" />
          </div>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/40 px-3 py-2.5 last:border-b-0">
              <Skeleton className="size-9 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-full max-w-56" />
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-2.5 w-12" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

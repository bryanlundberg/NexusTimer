import { Skeleton } from '@/components/ui/skeleton'

export function OverviewTabSkeleton() {
  return (
    <div className="flex flex-col border border-border/60 bg-card/40">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 border-b border-border/40 p-3 last:border-b-0 @xl/tab:flex-row @xl/tab:items-center @xl/tab:gap-6 @xl/tab:py-2.5"
        >
          <div className="flex items-center gap-2.5 @xl/tab:w-36 @xl/tab:shrink-0">
            <Skeleton className="size-9 shrink-0" />
            <Skeleton className="h-5 w-14" />
          </div>
          <div className="grid w-full grid-cols-3 gap-3 @xl/tab:flex-1 @xl/tab:pr-8">
            {Array.from({ length: 3 }, (_, j) => (
              <div key={j} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-6 w-16" />
                {j < 2 && <Skeleton className="h-2.5 w-24 max-w-full" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

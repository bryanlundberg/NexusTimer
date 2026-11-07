import { Skeleton } from '@/components/ui/skeleton'

export function CubesTabSkeleton() {
  return (
    <div className="flex flex-col border border-border/60 bg-card/40">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-2.5 border-b border-border/40 p-3 last:border-b-0 @3xl/tab:grid-cols-[15rem_minmax(0,1fr)_7rem] @3xl/tab:items-center @3xl/tab:gap-5 @3xl/tab:py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-6 w-14 max-w-full" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

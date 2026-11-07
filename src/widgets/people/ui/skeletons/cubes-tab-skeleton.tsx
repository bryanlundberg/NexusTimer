import { Skeleton } from '@/components/ui/skeleton'

export function CubesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 @xl/tab:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 border border-border/60 bg-card/40 p-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 @sm/tab:grid-cols-4 @xl/tab:grid-cols-2">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

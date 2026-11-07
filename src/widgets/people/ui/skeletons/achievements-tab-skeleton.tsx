import { Skeleton } from '@/components/ui/skeleton'

export function AchievementsTabSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-1 w-full sm:w-56" />
        </div>
        <Skeleton className="h-9 w-full sm:w-52" />
      </div>
      <div className="grid grid-cols-1 gap-3 @lg/tab:grid-cols-2 @4xl/tab:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-start gap-3 border border-border/60 bg-card/40 p-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-0.5 h-1 w-full" />
              <Skeleton className="h-2.5 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

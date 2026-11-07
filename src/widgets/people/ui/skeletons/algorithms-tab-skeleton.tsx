import { Skeleton } from '@/components/ui/skeleton'

export function AlgorithmsTabSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-hidden py-1 @xl/tab:flex-wrap @xl/tab:gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-30 w-26 shrink-0" />
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="ml-auto h-3 w-10" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} className="h-30" />
        ))}
      </div>
    </div>
  )
}

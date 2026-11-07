import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export function ProfileAsideSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex-col gap-8 border-l border-border/40 py-6 pr-4 pl-6 md:pr-6', className)}>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-2.5 w-24" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="mx-auto size-12 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-2.5 w-16" />
        <div className="flex flex-col">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <Skeleton className="size-7 shrink-0" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

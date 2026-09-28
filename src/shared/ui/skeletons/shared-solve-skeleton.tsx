import { Skeleton } from '@/components/ui/skeleton'
import { CoreHeaderSkeleton } from '@/shared/ui/skeletons/people-skeleton'

export default function SharedSolveSkeleton() {
  return (
    <div aria-hidden className="flex flex-col grow">
      <CoreHeaderSkeleton />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pt-8 pb-12">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-5 w-16 rounded-none" />
          <Skeleton className="h-15 w-56 sm:h-18 sm:w-64" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-none" />
            ))}
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2 px-8">
          <Skeleton className="h-3.5 w-full max-w-md" />
          <Skeleton className="h-3.5 w-2/3 max-w-xs" />
        </div>
      </div>
    </div>
  )
}

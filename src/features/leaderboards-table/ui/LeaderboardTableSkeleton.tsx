'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { GRID } from '@/features/leaderboards-table/ui/LeaderboardTable'

interface LeaderboardTableSkeletonProps {
  rows?: number
}

export default function LeaderboardTableSkeleton({ rows = 10 }: LeaderboardTableSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-3">
        <Skeleton className="h-36 sm:h-40" />
        <Skeleton className="h-44 sm:h-48" />
        <Skeleton className="h-36 sm:h-40" />
      </div>

      <div className="overflow-x-auto max-w-4xl mx-auto border border-border/60 bg-card/40">
        <div className="sm:min-w-160">
          <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60 bg-muted/30`}>
            <Skeleton className="h-2.5 w-4 justify-self-end" />
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="hidden h-2.5 w-8 sm:block" />
            <Skeleton className="hidden h-2.5 w-10 sm:block" />
            <Skeleton className="h-2.5 w-10 justify-self-end sm:justify-self-auto" />
            <Skeleton className="hidden h-2.5 w-12 sm:block" />
          </div>

          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0`}
            >
              <Skeleton className="h-3.5 w-6 justify-self-end" />

              <div className="flex items-center gap-2 min-w-0">
                <Skeleton className="size-7 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-28 max-w-full" />
              </div>

              <Skeleton className="hidden h-3 w-8 sm:block" />
              <Skeleton className="hidden h-3 w-8 sm:block" />
              <Skeleton className="h-4 w-16 justify-self-end sm:justify-self-auto" />
              <Skeleton className="hidden h-3.5 w-20 sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

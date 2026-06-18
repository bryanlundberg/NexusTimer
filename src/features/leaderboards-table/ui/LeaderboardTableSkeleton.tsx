'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { GRID } from '@/features/leaderboards-table/ui/LeaderboardTable'

interface LeaderboardTableSkeletonProps {
  rows?: number
}

export default function LeaderboardTableSkeleton({ rows = 10 }: LeaderboardTableSkeletonProps) {
  return (
    <div className="overflow-x-auto max-w-4xl mx-auto">
      <div className="min-w-160">
        <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
          <Skeleton className="h-2.5 w-4" />
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-12" />
        </div>

        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0`}
          >
            <Skeleton className="h-3.5 w-6 justify-self-end" />

            <div className="flex items-center gap-2 min-w-0">
              <Skeleton className="size-7 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-28" />
            </div>

            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

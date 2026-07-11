import { Skeleton } from '@/components/ui/skeleton'

export function HeroBannerSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 py-6 flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-border/40 bg-muted/20">
      {/* Left: avatar + info */}
      <div className="flex items-center gap-4 min-w-0">
        <Skeleton className="size-16 sm:size-20 md:size-24 rounded-lg shrink-0" />
        <div className="flex flex-col gap-2 min-w-0">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-7 w-48 sm:w-64" />
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Right: PB — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-4 md:gap-6 sm:ml-auto shrink-0">
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-2.5 w-48" />
          <Skeleton className="h-12 w-36 md:h-14 md:w-44" />
        </div>
        <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] rounded-lg" />
      </div>
    </div>
  )
}

export function StatsBarSkeleton() {
  return (
    <div className="w-full border-b border-border/40 bg-muted/20 grid grid-cols-2 sm:flex sm:divide-x sm:divide-border/40 divide-y divide-border/40 sm:divide-y-0 [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-border/40 sm:[&>*:nth-child(odd)]:border-r-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 px-4 py-3 flex-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  )
}

export function TabsNavSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-3 border-b border-border/40">
      <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-0.75 w-fit">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}

/** Inner table skeleton — caller provides the `px-4 md:px-6` wrapper. */
export function TabTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-4 px-3 py-2 border-b border-border/60">
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-2.5 flex-1" />
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-3 border-b border-border/40 last:border-b-0">
          <Skeleton className="size-9 rounded-lg shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-14 shrink-0" />
          <Skeleton className="h-4 w-14 shrink-0" />
          <Skeleton className="h-4 w-8 shrink-0" />
          <Skeleton className="h-4 w-16 shrink-0" />
          <div className="flex flex-col gap-1 w-20 shrink-0">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PeopleSkeleton() {
  return (
    <div className="flex flex-col grow">
      <HeroBannerSkeleton />
      <StatsBarSkeleton />
      <TabsNavSkeleton />
      <div className="px-4 md:px-6 py-0">
        <TabTableSkeleton />
      </div>
    </div>
  )
}

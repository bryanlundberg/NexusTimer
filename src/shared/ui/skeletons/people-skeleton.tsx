import { Skeleton } from '@/components/ui/skeleton'

/** Matches CoreHeader: sticky 12-height bar + accent stripe. */
export function CoreHeaderSkeleton() {
  return (
    <div className="w-full">
      <div className="h-12 border-b px-2 flex items-center gap-2">
        <Skeleton className="size-8 rounded-md shrink-0" />
        <div className="h-4 w-px bg-border shrink-0" />
        <Skeleton className="h-3.5 w-16" />
        <span className="text-border/60">/</span>
        <Skeleton className="h-3.5 w-28" />
      </div>
      <div className="flex w-full h-0.75" aria-hidden>
        <div className="flex-1 bg-cube-white" />
        <div className="flex-1 bg-cube-yellow" />
        <div className="flex-1 bg-cube-red" />
        <div className="flex-1 bg-cube-orange" />
        <div className="flex-1 bg-cube-blue" />
        <div className="flex-1 bg-cube-green" />
      </div>
    </div>
  )
}

export function HeroBannerSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 py-6 flex items-center gap-4 min-w-0 border-b border-border/40">
      <Skeleton className="size-16 sm:size-20 md:size-24 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 min-w-0">
        <Skeleton className="h-8 w-48 sm:w-64" />
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </div>
  )
}

export function BadgesStripSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 py-3 flex items-center gap-3 border-b border-border/40">
      <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-lg shrink-0" />
        ))}
      </div>
      <Skeleton className="h-3.5 w-14 shrink-0" />
    </div>
  )
}

export function TabsNavSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
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
      <CoreHeaderSkeleton />
      <div className="w-full max-w-4xl mx-auto flex flex-col">
        <HeroBannerSkeleton />
        <BadgesStripSkeleton />
        <TabsNavSkeleton />
        <div className="px-4 md:px-6 py-0">
          <TabTableSkeleton />
        </div>
      </div>
    </div>
  )
}

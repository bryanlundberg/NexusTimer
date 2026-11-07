import type * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileAsideSkeleton } from '@/shared/ui/skeletons/profile-aside-skeleton'

/** Matches CoreHeader: sticky 12-height bar. */
export function CoreHeaderSkeleton() {
  return (
    <div className="w-full">
      <div className="h-12 border-b px-2 flex items-center gap-2">
        <Skeleton className="size-8 shrink-0" />
        <div className="h-4 w-px bg-border shrink-0" />
        <Skeleton className="h-3.5 w-16" />
        <span className="text-border/60">/</span>
        <Skeleton className="h-3.5 w-28" />
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
          <Skeleton key={i} className="size-8 rounded-full shrink-0" />
        ))}
      </div>
      <Skeleton className="h-3.5 w-14 shrink-0" />
    </div>
  )
}

export function TabsNavSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
      <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
        <Skeleton className="h-4 w-16 sm:w-20 shrink-0" />
        <Skeleton className="h-4 w-14 sm:w-16 shrink-0" />
        <Skeleton className="hidden sm:block h-4 w-20 shrink-0" />
        <Skeleton className="hidden sm:block h-4 w-24 shrink-0" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-8 w-9 sm:w-24" />
        <Skeleton className="h-8 w-9 sm:w-24" />
      </div>
    </div>
  )
}

export default function PeopleSkeleton({ tabSkeleton }: { tabSkeleton: React.ReactNode }) {
  return (
    <div className="flex flex-col grow">
      <CoreHeaderSkeleton />
      <div className="@container/profile w-full max-w-6xl mx-auto">
        <div className="flex flex-col @5xl/profile:grid @5xl/profile:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="flex min-w-0 flex-col">
            <HeroBannerSkeleton />
            <div className="@5xl/profile:hidden">
              <BadgesStripSkeleton />
            </div>
            <TabsNavSkeleton />
            <div className="px-4 md:px-6 py-0">{tabSkeleton}</div>
          </div>
          <ProfileAsideSkeleton className="hidden self-start @5xl/profile:flex" />
        </div>
      </div>
    </div>
  )
}

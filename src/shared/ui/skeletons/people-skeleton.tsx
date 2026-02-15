import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Skeleton } from '@/components/ui/skeleton'

export default function PeopleSkeleton() {
  return (
    <div className="flex flex-col grow">
      {/* Header Skeleton (Imitando CoreHeader) */}
      <div className="w-full border-b p-2 flex justify-between items-center mb-2 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" /> {/* SidebarTrigger */}
          <div className="h-4 w-px bg-border mx-2" /> {/* Separator */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <div className="size-1 rounded-full bg-muted-foreground/20" /> {/* BreadcrumbSeparator */}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="hidden md:block h-6 w-32 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row px-2 relative">
          {/* UserInfo Skeleton */}
          <div className="flex flex-col gap-2 p-2 h-fit w-full md:max-w-xs">
            <div className="relative">
              <Skeleton className="size-60 mb-2 shadow-lg mx-auto rounded-full" />
            </div>
            <Skeleton className="h-7 w-48 mx-auto mb-2" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="w-full mt-2">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full mt-2" />
            <div className="h-px bg-border mt-2" />
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square size-12 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* PeopleContent Skeleton */}
          <div className="flex flex-col grow">
            <div className="flex items-center gap-2 mb-4 h-10 border-b">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-24 h-8" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card/50 p-5 h-[180px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <Skeleton className="h-3 w-10 ml-auto" />
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

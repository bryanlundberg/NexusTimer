import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Skeleton } from '@/components/ui/skeleton'

export default function PeopleSkeleton() {
  return (
    <div className="flex flex-col grow overflow-auto">
      <div className="max-w-7xl mx-auto p-4 flex flex-col w-full min-h-full">
        <div className={'flex flex-row gap-2'}>
          <Skeleton className={'w-20 h-8'} />
          <Skeleton className={'w-22 h-8'} />
          <Skeleton className={'w-26 h-8'} />
        </div>
        <div className="flex flex-col md:flex-row p-5 relative">
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
          <div className="flex flex-col grow">
            <Skeleton className="w-full max-w-60 h-8 rounded mb-4"></Skeleton>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Skeleton className="h-64"></Skeleton>
              <Skeleton className="h-64"></Skeleton>
              <Skeleton className="h-64"></Skeleton>
              <Skeleton className="h-64"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

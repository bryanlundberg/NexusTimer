import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Skeleton } from '@/components/ui/skeleton'

export default function PeopleSkeleton() {
  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      <div className="max-w-7xl mx-auto p-4 flex flex-col w-full min-h-full">
        <div className={'flex flex-row gap-2'}>
          <Skeleton className={'w-20 h-8'} />
          <Skeleton className={'w-22 h-8'} />
          <Skeleton className={'w-26 h-8'} />
        </div>
        <div className="flex flex-col md:flex-row p-5 relative">
          <div className="flex flex-col items-center justify-center w-full md:w-1/4 h-64">
            <Skeleton className="w-24 h-24 rounded-full mb-4"></Skeleton>
            <Skeleton className="w-3/4 h-6  rounded mb-2"></Skeleton>
            <Skeleton className="w-1/2 h-6  rounded"></Skeleton>
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
    </FadeIn>
  )
}

'use client'
import { useRef } from 'react'
import { notFound } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { ScrollArea } from '@/components/ui/scroll-area'
import PeopleSkeleton from '@/shared/ui/skeletons/people-skeleton'
import { useUser } from '@/entities/user/model/useUser'
import { useUserStats } from '@/entities/user-stats/model/useUserStats'
import { UserHeader } from '@/widgets/people/ui/UserHeader'
import { PeopleTabs } from '@/widgets/people/ui/PeopleTabs'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { PullToRefresh } from '@/shared/ui/pull-to-refresh/PullToRefresh'
import { useRouteSegment } from '@/shared/model/useRouteSegment'

export default function PeopleDetailsPage() {
  const userId = useRouteSegment('/people')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { cache, mutate } = useSWRConfig()

  const { data: user, isLoading: isLoadingUser } = useUser(userId)
  const { stats, isLoading: isLoadingStats } = useUserStats(userId)

  if (user === null) notFound()

  const refreshProfile = () =>
    Promise.all(
      Array.from(cache.keys())
        .filter((key) => key.includes(userId))
        .map((key) => mutate(key))
    )

  return (
    <ScrollArea ref={scrollRef} className={'max-h-dvh overflow-auto'}>
      {isLoadingUser || !user ? (
        <PeopleSkeleton />
      ) : (
        <>
          <UserHeader user={user} />
          <PullToRefresh scrollerRef={scrollRef} onRefresh={refreshProfile} />
          <PageBody variant="hero" className={'pt-0 w-full max-w-4xl mx-auto'}>
            <PeopleTabs user={user} stats={stats} isLoadingStats={isLoadingStats} />
          </PageBody>
        </>
      )}
    </ScrollArea>
  )
}

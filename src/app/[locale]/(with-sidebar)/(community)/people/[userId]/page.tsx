'use client'
import { useEffect, useRef } from 'react'
import { isObjectId } from '@nexustimer/contracts'
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
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { ProfileTabSkeleton } from '@/widgets/people/ui/skeletons/profile-tab-skeleton'

export default function PeopleDetailsPage() {
  const segment = useRouteSegment('/people')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { cache, mutate } = useSWRConfig()

  const { data: user, isLoading: isLoadingUser } = useUser(segment)
  const userId: string | undefined = isObjectId(segment) ? segment : user?._id
  const { stats, isLoading: isLoadingStats } = useUserStats(userId)
  const username: string | undefined = user?.username
  const { value: tab } = usePeopleTab()

  useEffect(() => {
    if (!user || !username || segment === username) return
    mutate(`/api/v1/users/${username}`, user, { revalidate: false })
    const { pathname, search, hash } = window.location
    const shortPath = pathname.replace(/\/people\/[^/]+/, `/people/${username}`)
    window.history.replaceState(window.history.state, '', `${shortPath}${search}${hash}`)
  }, [segment, username, user, mutate])

  if (user === null) notFound()

  const refreshProfile = () =>
    Promise.all(
      Array.from(cache.keys())
        .filter((key) => key.includes(segment) || (!!userId && key.includes(userId)))
        .map((key) => mutate(key))
    )

  return (
    <ScrollArea ref={scrollRef} className={'max-h-dvh overflow-auto'}>
      {isLoadingUser || !user ? (
        <PeopleSkeleton tabSkeleton={<ProfileTabSkeleton tab={tab} />} />
      ) : (
        <>
          <UserHeader user={user} />
          <PullToRefresh scrollerRef={scrollRef} onRefresh={refreshProfile} />
          <PageBody variant="hero" className={'pt-0 w-full max-w-6xl mx-auto'}>
            <PeopleTabs user={user} stats={stats} isLoadingStats={isLoadingStats} />
          </PageBody>
        </>
      )}
    </ScrollArea>
  )
}

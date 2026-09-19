'use client'
import { useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import PeopleSkeleton from '@/shared/ui/skeletons/people-skeleton'
import { useUser } from '@/entities/user/model/useUser'
import { useUserStats } from '@/entities/user-stats/model/useUserStats'
import { UserHeader } from '@/widgets/people/ui/UserHeader'
import { PeopleTabs } from '@/widgets/people/ui/PeopleTabs'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function PeopleDetailsPage() {
  const { userId } = useParams<{ userId: string }>() ?? { userId: '' }

  const { data: user, isLoading: isLoadingUser } = useUser(userId)
  const { stats, isLoading: isLoadingStats } = useUserStats(userId)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      {isLoadingUser || !user ? (
        <PeopleSkeleton />
      ) : (
        <>
          <UserHeader user={user} />
          <PageBody variant="hero" className={'pt-0 w-full max-w-4xl mx-auto'}>
            <PeopleTabs user={user} stats={stats} isLoadingStats={isLoadingStats} />
          </PageBody>
        </>
      )}
    </ScrollArea>
  )
}

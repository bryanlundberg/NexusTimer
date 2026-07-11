'use client'
import { useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import PeopleSkeleton from '@/shared/ui/skeletons/people-skeleton'
import { useBackup } from '@/entities/backup/model/useBackup'
import { useUser } from '@/entities/user/model/useUser'
import { filterCubes } from '@/entities/cube/lib/filterCubes'
import { UserHeader } from '@/widgets/people/ui/UserHeader'
import { PeopleTabs } from '@/widgets/people/ui/PeopleTabs'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function PeopleDetailsPage() {
  const { userId } = useParams<{ userId: string }>() ?? { userId: '' }

  const { data: user, isLoading: isLoadingUser } = useUser(userId)
  const { backup, isLoading: isLoadingBackup } = useBackup(user?.backup?.url)

  const isLoadingStats = !!user?.backup?.url && isLoadingBackup

  const cubes = filterCubes(backup)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      {isLoadingUser || !user ? (
        <PeopleSkeleton />
      ) : (
        <>
          <UserHeader user={user} />
          <PageBody variant="hero" className={'pt-0'}>
            <PeopleTabs user={user} cubes={cubes} isLoadingStats={isLoadingStats} />
          </PageBody>
        </>
      )}
    </ScrollArea>
  )
}

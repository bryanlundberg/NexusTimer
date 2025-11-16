'use client'
import { useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import PeopleSkeleton from '@/shared/ui/skeletons/people-skeleton'
import { useBackup } from '@/entities/backup/model/useBackup'
import { useUser } from '@/entities/user/model/useUser'
import { filterCubes } from '@/entities/cube/lib/filterCubes'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { UserHeader } from '@/widgets/people/ui/UserHeader'
import { PeopleTabs } from '@/widgets/people/ui/PeopleTabs'

export default function PeopleDetailsPage() {
  const params = useParams<{ userId: string }>()
  const userId = params.userId

  const { data: user, isLoading: isLoadingUser } = useUser(userId)
  const { backup, isLoading: isLoadingBackup } = useBackup(user?.backup?.url)

  if (isLoadingUser || isLoadingBackup) {
    return <PeopleSkeleton />
  }

  const cubes = filterCubes(backup)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <UserHeader user={user} />
        <PeopleTabs user={user} cubes={cubes} />
      </FadeIn>
    </ScrollArea>
  )
}

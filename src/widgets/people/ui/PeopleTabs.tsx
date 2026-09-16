'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import { ProfileHeroBanner } from '@/widgets/people/ui/profile-hero-banner'
import { ProfileBadgesStrip } from '@/widgets/people/ui/profile-badges-strip'
import { ProfileCompletenessBar } from '@/widgets/people/ui/profile-completeness'
import { ProfileActions } from '@/widgets/people/ui/profile-actions'
import { CompareUserButton } from '@/widgets/people/ui/compare-user-button'
import { TabTableSkeleton } from '@/shared/ui/skeletons/people-skeleton'
import { UserProfile } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import useUserBadges from '@/entities/achievement/model/useUserBadges'
import { useUserLearned } from '@/entities/trainer-learned/model/useUserLearned'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRelationship } from '@/entities/friendship/model/useFriends'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { MutualFriends } from '@/features/friends/ui/MutualFriends'

interface PeopleTabsProps {
  user: UserProfile
  cubes: Array<Cube>
  isLoadingStats?: boolean
}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.TIMELINE, PTabs.ALGORITHMS] as const

export function PeopleTabs({ user, cubes, isLoadingStats = false }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const userBadges = useUserBadges({ user, cubes })
  const { data: learned } = useUserLearned(user._id)

  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const { data: relationship } = useRelationship(user._id)
  const hasIncomingRequest = relationship?.status === 'pending_in'

  const { value, set } = usePeopleTab()

  const labels: Record<PTabs, string> = {
    [PTabs.OVERVIEW]: t('overview'),
    [PTabs.CUBES]: t('cubes'),
    [PTabs.TIMELINE]: t('timeline'),
    [PTabs.ALGORITHMS]: t('algorithms'),
    [PTabs.ACHIEVEMENTS]: t('achievements')
  }

  const counts = useMemo<Partial<Record<PTabs, number>>>(() => {
    const solves = [
      ...cubes.flatMap((cube) => cube.solves.session.map((s) => ({ ...s, category: cube.category }))),
      ...cubes.flatMap((cube) => cube.solves.all.map((s) => ({ ...s, category: cube.category })))
    ].filter((s) => !s.isDeleted)

    return {
      [PTabs.OVERVIEW]: new Set(solves.map((s) => s.category)).size,
      [PTabs.CUBES]: cubes.length,
      [PTabs.TIMELINE]: solves.length,
      [PTabs.ALGORITHMS]: learned?.total ?? 0
    }
  }, [cubes, learned?.total])

  return (
    <div className="flex flex-col w-full">
      <ProfileHeroBanner
        user={user}
        level={userBadges.earnedTiers}
        actions={
          <ProfileActions
            user={user}
            isCurrentUser={isCurrentUser}
            status={relationship?.status}
            className="max-sm:hidden sm:self-end"
          />
        }
      >
        {relationship?.mutual && <MutualFriends mutual={relationship.mutual} />}
        {hasIncomingRequest && (
          <div className="mt-1.5">
            <FriendButton userId={user._id} name={user.name} status="pending_in" />
          </div>
        )}
        <ProfileActions
          user={user}
          isCurrentUser={isCurrentUser}
          status={relationship?.status}
          className="mt-1.5 sm:hidden"
        >
          <CompareUserButton user={user} />
        </ProfileActions>
      </ProfileHeroBanner>
      {isCurrentUser && <ProfileCompletenessBar user={user} />}
      {!isLoadingStats && <ProfileBadgesStrip badges={userBadges} />}

      <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full mb-5">
        {/* Tabs nav + compare */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
          <div className="min-w-0 flex-1">
            <ScrollableUnderlineTabs
              items={tabs.map((tab) => ({
                value: tab,
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    {labels[tab]}
                    {!isLoadingStats && counts[tab] != null && (
                      <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-muted text-[10px] font-semibold tabular-nums leading-none text-muted-foreground transition-colors group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary">
                        {counts[tab]}
                      </span>
                    )}
                  </span>
                )
              }))}
              activeValue={value}
              layoutId="people-tab-indicator"
            />
          </div>

          <CompareUserButton user={user} className="max-sm:hidden sm:shrink-0" />
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-6 py-0">
          {isLoadingStats ? (
            <TabTableSkeleton />
          ) : (
            <PeopleContent cubes={cubes} badges={userBadges} learnedMethods={learned?.methods} />
          )}
        </div>
      </Tabs>
    </div>
  )
}

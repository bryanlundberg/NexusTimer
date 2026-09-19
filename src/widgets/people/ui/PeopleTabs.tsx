'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { ProfileHeroBanner } from '@/widgets/people/ui/profile-hero-banner'
import { ProfileBadgesStrip } from '@/widgets/people/ui/profile-badges-strip'
import { ProfileCompletenessBar } from '@/widgets/people/ui/profile-completeness'
import { ProfileActions } from '@/widgets/people/ui/profile-actions'
import { CompareUserButton } from '@/widgets/people/ui/compare-user-button'
import { TabTableSkeleton } from '@/shared/ui/skeletons/people-skeleton'
import { UserProfile } from '@/entities/user/model/user'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'
import useUserBadges from '@/entities/achievement/model/useUserBadges'
import { useUserLearned } from '@/entities/trainer-learned/model/useUserLearned'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRelationship } from '@/entities/friendship/model/useFriends'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { MutualFriends } from '@/features/friends/ui/MutualFriends'

interface PeopleTabsProps {
  user: UserProfile
  stats: UserStatsSummary | null
  isLoadingStats?: boolean
}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.TIMELINE, PTabs.ALGORITHMS] as const

export function PeopleTabs({ user, stats, isLoadingStats = false }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const tPeople = useTranslations('Index.PeoplePage')
  const userBadges = useUserBadges({ user, stats })
  const { data: learned } = useUserLearned(user._id)

  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const { data: relationship } = useRelationship(user._id)
  const hasIncomingRequest = relationship?.status === 'pending_in'
  const statsHidden = !!user.statsHidden

  const { value, set } = usePeopleTab()

  const labels: Record<PTabs, string> = {
    [PTabs.OVERVIEW]: t('overview'),
    [PTabs.CUBES]: t('cubes'),
    [PTabs.TIMELINE]: t('timeline'),
    [PTabs.ALGORITHMS]: t('algorithms'),
    [PTabs.ACHIEVEMENTS]: t('achievements')
  }

  const counts: Partial<Record<PTabs, number>> = {
    [PTabs.OVERVIEW]: stats?.categories.length ?? 0,
    [PTabs.CUBES]: stats?.cubes.length ?? 0,
    [PTabs.TIMELINE]: stats?.totalSolves ?? 0,
    [PTabs.ALGORITHMS]: learned?.total ?? 0
  }

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
            canRequest={relationship?.canRequest}
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
          canRequest={relationship?.canRequest}
          className="mt-1.5 sm:hidden"
        >
          {!statsHidden && <CompareUserButton user={user} />}
        </ProfileActions>
      </ProfileHeroBanner>
      {isCurrentUser && <ProfileCompletenessBar user={user} />}
      {!isLoadingStats && !statsHidden && <ProfileBadgesStrip badges={userBadges} />}

      <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
          <div className="min-w-0 flex-1">
            <ScrollableUnderlineTabs
              items={tabs.map((tab) => ({
                value: tab,
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    {labels[tab]}
                    {!isLoadingStats && !statsHidden && counts[tab] != null && (
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

          {!statsHidden && <CompareUserButton user={user} className="max-sm:hidden sm:shrink-0" />}
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-6 py-0">
          {statsHidden ? (
            <EmptyTabContent message={tPeople('stats-hidden', { name: user.name })} />
          ) : isLoadingStats ? (
            <TabTableSkeleton />
          ) : (
            <PeopleContent stats={stats} badges={userBadges} learnedMethods={learned?.methods} />
          )}
        </div>
      </Tabs>
    </div>
  )
}

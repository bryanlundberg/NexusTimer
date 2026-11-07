'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { ProfileHeroBanner } from '@/widgets/people/ui/profile-hero-banner'
import { ProfileCompletenessBar } from '@/widgets/people/ui/profile-completeness'
import { ProfileBadgesStrip } from '@/widgets/people/ui/profile-badges-strip'
import { ProfileActions } from '@/widgets/people/ui/profile-actions'
import { CompareUserButton } from '@/widgets/people/ui/compare-user-button'
import { ProfileTabSkeleton } from '@/widgets/people/ui/skeletons/profile-tab-skeleton'
import { ProfileBadgesPanel } from '@/widgets/people/ui/profile-badges-panel'
import { ProfileStatsPanel } from '@/widgets/people/ui/profile-stats-panel'
import { ProfileSharedPanel } from '@/widgets/people/ui/profile-shared-panel'
import { UserProfile } from '@/entities/user/model/user'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'
import useUserBadges from '@/entities/achievement/model/useUserBadges'
import { useUserLearned } from '@/entities/trainer-learned/model/useUserLearned'
import { useTranslations } from 'next-intl'
import { useSession } from '@/shared/model/useSession'
import { useRelationship } from '@/entities/friendship/model/useFriends'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { MutualFriends } from '@/features/friends/ui/MutualFriends'
import { useUserSharedSolves } from '@/entities/shared-solve/model/useUserSharedSolves'
import SharedTabContent from '@/widgets/people/ui/shared-tab-content'
import { ProfileMonthActivity } from '@/widgets/people/ui/profile-month-activity'

interface PeopleTabsProps {
  user: UserProfile
  stats: UserStatsSummary | null
  isLoadingStats?: boolean
}

const NO_DAILY_SOLVES: Record<string, number> = {}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.TIMELINE, PTabs.ALGORITHMS, PTabs.ACHIEVEMENTS, PTabs.SHARED] as const

export function PeopleTabs({ user, stats, isLoadingStats = false }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const tPeople = useTranslations('Index.PeoplePage')
  const userBadges = useUserBadges({ user, stats })
  const { data: learned } = useUserLearned(user._id)
  const shared = useUserSharedSolves(user._id)

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
    [PTabs.ACHIEVEMENTS]: t('achievements'),
    [PTabs.SHARED]: t('shared')
  }

  const counts: Partial<Record<PTabs, number>> = {
    [PTabs.OVERVIEW]: stats?.categories.length ?? 0,
    [PTabs.CUBES]: stats?.cubes.length ?? 0,
    [PTabs.TIMELINE]: stats?.totalSolves ?? 0,
    [PTabs.ALGORITHMS]: learned?.total ?? 0,
    [PTabs.ACHIEVEMENTS]: userBadges.unlockedFamilies.length
  }

  const showCount = (tab: PTabs) =>
    tab === PTabs.SHARED ? !shared.isLoading : !isLoadingStats && !statsHidden && counts[tab] != null

  const countOf = (tab: PTabs) => (tab === PTabs.SHARED ? shared.total : counts[tab])

  const showStats = !isLoadingStats && !statsHidden
  const timezone = stats?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const dailySolves = stats?.dailySolves ?? NO_DAILY_SOLVES

  return (
    <div className="@container/profile w-full">
      <div className="flex flex-col @5xl/profile:grid @5xl/profile:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col">
          <ProfileHeroBanner
            user={user}
            aside={
              showStats && (
                <ProfileMonthActivity
                  key={user._id}
                  dailySolves={dailySolves}
                  timezone={timezone}
                  className="hidden shrink-0 @4xl/profile:flex @5xl/profile:hidden"
                />
              )
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
              isSignedIn={!!session?.user?.id}
              status={relationship?.status}
              canRequest={relationship?.canRequest}
              className="mt-1.5"
            />
          </ProfileHeroBanner>
          {showStats && (
            <ProfileStatsPanel
              stats={stats}
              algorithmsLearned={learned?.total}
              className="border-b border-border/40 px-4 py-4 md:px-6 @lg/profile:grid-cols-4 @5xl/profile:hidden"
            />
          )}
          {isCurrentUser && <ProfileCompletenessBar user={user} />}
          {showStats && (
            <div className="@5xl/profile:hidden">
              <ProfileBadgesStrip badges={userBadges} />
            </div>
          )}

          <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full mb-5">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
              <div className="min-w-0 flex-1">
                <ScrollableUnderlineTabs
                  items={tabs.map((tab) => ({
                    value: tab,
                    label: (
                      <span className="inline-flex items-center gap-1.5">
                        {labels[tab]}
                        {showCount(tab) && (
                          <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 bg-muted text-[10px] font-semibold tabular-nums leading-none text-muted-foreground transition-colors group-data-[state=active]:bg-primary/15 group-data-[state=active]:text-foreground">
                            {countOf(tab)}
                          </span>
                        )}
                      </span>
                    )
                  }))}
                  activeValue={value}
                  layoutId="people-tab-indicator"
                />
              </div>

              {!statsHidden && <CompareUserButton user={user} className="shrink-0" />}
            </div>

            {/* Tab content */}
            <div className="px-4 md:px-6 py-0">
              {value === PTabs.SHARED ? (
                <SharedTabContent user={user} isCurrentUser={isCurrentUser} shared={shared} />
              ) : statsHidden ? (
                <EmptyTabContent message={tPeople('stats-hidden', { name: user.name })} />
              ) : isLoadingStats ? (
                <ProfileTabSkeleton tab={value} />
              ) : (
                <PeopleContent stats={stats} badges={userBadges} learnedMethods={learned?.methods} />
              )}
            </div>
          </Tabs>
        </div>

        {(showStats || shared.items.length > 0) && (
          <aside className="sticky top-16 hidden flex-col gap-8 self-start border-l border-border/40 py-6 pr-4 pl-6 md:pr-6 @5xl/profile:flex">
            {showStats && <ProfileStatsPanel stats={stats} algorithmsLearned={learned?.total} />}
            {showStats && <ProfileBadgesPanel badges={userBadges} />}
            <ProfileSharedPanel items={shared.items} total={shared.total} />
          </aside>
        )}
      </div>
    </div>
  )
}

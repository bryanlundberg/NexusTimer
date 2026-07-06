'use client'

import { Tabs } from '@/components/ui/tabs'
import AnimatedTabsList from '@/shared/ui/animated-tabs/AnimatedTabsList'
import { Button } from '@/components/ui/button'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import { ProfileHeroBanner } from '@/widgets/people/ui/profile-hero-banner'
import { ProfileBadgesStrip } from '@/widgets/people/ui/profile-badges-strip'
import { ProfileStatsBar } from '@/widgets/people/ui/profile-stats-bar'
import { UserProfile } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import useUserBadges from '@/entities/achievement/model/useUserBadges'
import { useUserLearned } from '@/entities/trainer-learned/model/useUserLearned'
import { useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'
import { CheckCircle2, GitCompareIcon, Pencil } from 'lucide-react'

interface PeopleTabsProps {
  user: UserProfile
  cubes: Array<Cube>
}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.TIMELINE, PTabs.ALGORITHMS] as const

export function PeopleTabs({ user, cubes }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const userBadges = useUserBadges({ user, cubes })
  const { data: learned } = useUserLearned(user._id)
  const tProfile = useTranslations('Index.PeoplePage')
  const tCard = useTranslations('Index.PeoplePage.user-card')

  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const router = useRouter()

  const addUser = useCompareUsersStore((state) => state.addUser)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const isAdded = !!users.find((u) => u._id === user._id)

  const [isFlying, setIsFlying] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const compareRef = useRef<HTMLButtonElement>(null)

  const handleCompareClick = () => {
    if (!isAdded) {
      if (compareRef.current) {
        const rect = compareRef.current.getBoundingClientRect()
        setStartPos({ x: rect.left, y: rect.top })
        setIsFlying(true)
      }
      addUser(user)
    } else {
      removeUser(user._id)
    }
  }

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
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      <ProfileHeroBanner user={user} cubes={cubes} level={userBadges.unlocked.length} />
      <ProfileStatsBar cubes={cubes} algorithmsLearned={learned?.total ?? 0} />
      <ProfileBadgesStrip badges={userBadges} />

      <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full mb-5">
        {/* Tabs nav + actions row */}
        <div className="flex flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 mt-3">
          <div className="min-w-0 flex-1 overflow-x-auto">
            <AnimatedTabsList
              items={tabs.map((tab) => ({
                value: tab,
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    {labels[tab]}
                    {counts[tab] != null && (
                      <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-muted text-[10px] font-semibold tabular-nums leading-none text-muted-foreground transition-colors group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary">
                        {counts[tab]}
                      </span>
                    )}
                  </span>
                )
              }))}
              activeValue={value}
              layoutId="people-tab-indicator"
              fitted
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCurrentUser && (
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => router.push('/account')}>
                <Pencil className="size-4" />
                <span className="hidden sm:inline">{tProfile('edit-profile')}</span>
              </Button>
            )}
            <Button
              ref={compareRef}
              variant={isAdded ? 'secondary' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={handleCompareClick}
            >
              {isAdded ? (
                <CheckCircle2 className="size-4 text-primary animate-in zoom-in duration-300" />
              ) : (
                <GitCompareIcon className="size-4" />
              )}
              <span className="hidden sm:inline">{tCard('compare')}</span>
            </Button>
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-6 py-0">
          <PeopleContent cubes={cubes} badges={userBadges} learnedMethods={learned?.methods} />
        </div>
      </Tabs>
    </div>
  )
}

import type { ReactNode } from 'react'
import { PeopleTabs } from '@/widgets/people/model/types'
import { OverviewTabSkeleton } from '@/widgets/people/ui/skeletons/overview-tab-skeleton'
import { CubesTabSkeleton } from '@/widgets/people/ui/skeletons/cubes-tab-skeleton'
import { AlgorithmsTabSkeleton } from '@/widgets/people/ui/skeletons/algorithms-tab-skeleton'
import { AchievementsTabSkeleton } from '@/widgets/people/ui/skeletons/achievements-tab-skeleton'
import { SolveListSkeleton } from '@/widgets/people/ui/skeletons/solve-list-skeleton'

const SKELETONS: Record<PeopleTabs, () => ReactNode> = {
  [PeopleTabs.OVERVIEW]: OverviewTabSkeleton,
  [PeopleTabs.CUBES]: CubesTabSkeleton,
  [PeopleTabs.TIMELINE]: SolveListSkeleton,
  [PeopleTabs.ALGORITHMS]: AlgorithmsTabSkeleton,
  [PeopleTabs.ACHIEVEMENTS]: AchievementsTabSkeleton,
  [PeopleTabs.SHARED]: SolveListSkeleton
}

export function ProfileTabSkeleton({ tab }: { tab: PeopleTabs }) {
  const TabSkeleton = SKELETONS[tab] ?? OverviewTabSkeleton

  return (
    <div className="mt-2 @container/tab">
      <TabSkeleton />
    </div>
  )
}

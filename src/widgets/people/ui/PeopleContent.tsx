import { TabsContent } from '@/components/ui/tabs'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import OverviewTabContent from '@/widgets/people/ui/overview-tab-content'
import CubesTabContent from '@/widgets/people/ui/cubes-tab-content'
import TimelineTabContent from '@/widgets/people/ui/timeline-tab-content'
import AchievementsTabContent from '@/widgets/people/ui/achievements-tab-content'
import AlgorithmsTabContent from '@/widgets/people/ui/algorithms-tab-content'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import type { LearnedMethod } from '@/entities/trainer-learned/model/useUserLearned'

interface Props {
  stats: UserStatsSummary | null
  badges: UserBadgesResult
  learnedMethods?: LearnedMethod[]
}

export function PeopleContent({ stats, badges, learnedMethods }: Props) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row relative mt-2">
        <div className="flex flex-col grow @container/tab">
          <TabsContent value={PTabs.OVERVIEW}>
            <OverviewTabContent categories={stats?.categories ?? []} />
          </TabsContent>
          <TabsContent value={PTabs.CUBES}>
            <CubesTabContent cubes={stats?.cubes ?? []} />
          </TabsContent>
          <TabsContent value={PTabs.TIMELINE}>
            <TimelineTabContent solves={stats?.recentSolves ?? []} totalSolves={stats?.totalSolves ?? 0} />
          </TabsContent>
          <TabsContent value={PTabs.ALGORITHMS}>
            <AlgorithmsTabContent methods={learnedMethods} />
          </TabsContent>
          <TabsContent value={PTabs.ACHIEVEMENTS}>
            <AchievementsTabContent badges={badges} />
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

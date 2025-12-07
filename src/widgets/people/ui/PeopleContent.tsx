import { TabsContent } from '@/components/ui/tabs'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import OverviewTabContent from '@/widgets/people/ui/overview-tab-content'
import CubesTabContent from '@/widgets/people/ui/cubes-tab-content'
import LastActivityTabContent from '@/widgets/people/ui/last-activity-tab-content'
import { Cube } from '@/entities/cube/model/types'

interface Props {
  cubes: Array<Cube>
}

export function PeopleContent({ cubes }: Props) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row relative mt-2">
        <div className="flex flex-col grow">
          <TabsContent value={PTabs.OVERVIEW}>
            <OverviewTabContent cubes={cubes} />
          </TabsContent>
          <TabsContent value={PTabs.CUBES}>
            <CubesTabContent cubes={cubes} />
          </TabsContent>
          <TabsContent value={PTabs.LAST_ACTIVITY}>
            <LastActivityTabContent cubes={cubes} />
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

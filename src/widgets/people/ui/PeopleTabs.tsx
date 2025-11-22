import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import UserInfo from '@/entities/user/ui/user-info'

interface PeopleTabsProps {
  user: any
  cubes: any[]
}

export function PeopleTabs({ user, cubes }: PeopleTabsProps) {
  const { value, set } = usePeopleTab()

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row p-5 relative">
        <UserInfo user={user} />
        <div className="flex flex-col grow">
          <Tabs defaultValue={value} className="w-full">
            <TabsList>
              <TabsTrigger onClick={() => set(PTabs.OVERVIEW)} value={PTabs.OVERVIEW}>
                Overview
              </TabsTrigger>
              <TabsTrigger onClick={() => set(PTabs.CUBES)} value={PTabs.CUBES}>
                Cubes
              </TabsTrigger>
              <TabsTrigger onClick={() => set(PTabs.LAST_ACTIVITY)} value={PTabs.LAST_ACTIVITY}>
                Last activity
              </TabsTrigger>
            </TabsList>
            <PeopleContent cubes={cubes} />
          </Tabs>
        </div>
      </div>
    </div>
  )
}

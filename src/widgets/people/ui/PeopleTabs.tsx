import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import UserInfo from '@/entities/user/ui/user-info'
import { UserDocument } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'

interface PeopleTabsProps {
  user: UserDocument
  cubes: Array<Cube>
}

export function PeopleTabs({ user, cubes }: PeopleTabsProps) {
  const { value, set } = usePeopleTab()

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row p-5 relative">
        <UserInfo user={user} />
        <div className="flex flex-col grow">
          <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full">
            <TabsList>
              <TabsTrigger value={PTabs.OVERVIEW}>Overview</TabsTrigger>
              <TabsTrigger value={PTabs.CUBES}>Cubes</TabsTrigger>
              <TabsTrigger value={PTabs.LAST_ACTIVITY}>Last activity</TabsTrigger>
            </TabsList>
            <PeopleContent cubes={cubes} />
          </Tabs>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useParams } from 'next/navigation'
import FadeIn from '@/components/fade-in/fade-in'
import { useUser } from '@/hooks/api/useUser'
import * as React from 'react'
import { useMemo } from 'react'
import { useBackup } from '@/hooks/api/useBackup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PeopleTabs } from '@/enums/PeopleTabs'
import { useQueryState } from 'nuqs'
import { STATES } from '@/constants/states'
import { Cube } from '@/interfaces/Cube'
import LastActivityTabContent from '@/components/people/last-activity-tab-content'
import CubesTabContent from '@/components/people/cubes-tab-content'
import OverviewTabContent from '@/components/people/overview-tab-content'
import UserInfo from '@/components/people/user-info'
import PeopleSkeleton from '@/components/people/people-skeleton'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'

export default function Page() {
  const params = useParams<{ userId: string }>()
  const userId = params.userId
  const { data: user, isLoading: isLoadingUser } = useUser(userId)
  const { backup, isLoading: isLoadingBackup } = useBackup(user?.backup?.url)
  const [tab, setTab] = useQueryState(STATES.PEOPLE_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.PEOPLE_PAGE.TAB_MODE.DEFAULT_VALUE
  })
  const handleChangeTab = (value: PeopleTabs) => setTab(value)

  if (isLoadingUser || isLoadingBackup) {
    return <PeopleSkeleton />
  }

  const filteredCubes: Cube[] = useMemo(() => {
    return (backup || [])?.filter((cube) => {
      if (cube.isDeleted) return false

      const allSolves = cube.solves.all.filter((solve) => !solve.isDeleted)
      const allSessions = cube.solves.session.filter((solve) => !solve.isDeleted)

      cube.solves.all = allSolves
      cube.solves.session = allSessions

      return true
    })
  }, [backup])

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={'/people'}>People</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{user.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row p-5 relative">
            <UserInfo user={user} />
            <div className="flex flex-col ml-4 grow">
              <Tabs defaultValue={tab} className="w-full">
                <TabsList>
                  <TabsTrigger onClick={() => handleChangeTab(PeopleTabs.OVERVIEW)} value={PeopleTabs.OVERVIEW}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger onClick={() => handleChangeTab(PeopleTabs.CUBES)} value={PeopleTabs.CUBES}>
                    Cubes
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => handleChangeTab(PeopleTabs.LAST_ACTIVITY)}
                    value={PeopleTabs.LAST_ACTIVITY}
                  >
                    Last activity
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={PeopleTabs.OVERVIEW}>
                  <OverviewTabContent cubes={filteredCubes || []} />
                </TabsContent>
                <TabsContent value={PeopleTabs.CUBES}>
                  <CubesTabContent cubes={filteredCubes || []} />
                </TabsContent>
                <TabsContent value={PeopleTabs.LAST_ACTIVITY}>
                  <LastActivityTabContent cubes={filteredCubes || []} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </FadeIn>
    </ScrollArea>
  )
}

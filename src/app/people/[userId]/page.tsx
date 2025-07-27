'use client';
import { useParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import FadeIn from '@/components/fade-in/fade-in';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/hooks/api/useUser';
import * as React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useBackup } from '@/hooks/api/useBackup';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline';
import { PeopleTabs } from '@/enums/PeopleTabs';
import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { Cube } from '@/interfaces/Cube';
import { importNexusTimerData } from '@/lib/importDataFromFile';
import LastActivityTabContent from '@/components/people/last-activity-tab-content';
import CubesTabContent from '@/components/people/cubes-tab-content';
import OverviewTabContent from '@/components/people/overview-tab-content';

export default function Page() {
  const params = useParams<{ userId: string; }>()
  const userId = params.userId;
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { backup: backupString, isLoading: isLoadingBackup } = useBackup(userId);
  const [tab, setTab] = useQueryState(STATES.PEOPLE_PAGE.TAB_MODE.KEY, { defaultValue: STATES.PEOPLE_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [backup, setBackup] = React.useState<Cube[]>([]);
  const handleChangeTab = (value: PeopleTabs) => setTab(value);

  useEffect(() => {
    const parseBackup = () => {
      if (backupString?.data) {
        try {
          const parsedBackup = importNexusTimerData(backupString?.data);
          setBackup(parsedBackup);
        } catch (error) {
          console.error('Error parsing backup string:', error);
          setBackup([]);
        }
      }
    }
    parseBackup();
  }, [backupString,]);

  if (isLoadingUser || isLoadingBackup) {
    return (
      <FadeIn className="flex flex-col grow items-center justify-center">
        <div className="text-lg">Loading user data...</div>
      </FadeIn>
    );
  }

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      <div className="max-w-7xl mx-auto p-4 flex flex-col w-full min-h-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/people'}>People</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              {user.name}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row p-5">
          <div className="flex flex-col gap-2 items-center p-4">
            <Avatar className="size-40 mb-2 shadow-lg">
              <AvatarImage className={'object-cover'} src={user.image} alt={user.name}/>
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={'flex items-center gap-1'}><GlobeAmericasIcon className={'size-5'}/> Asia/ Jakarta</div>
            <Badge variant={'secondary'}>Road Sub 10</Badge>
          </div>

          <div className="flex flex-col ml-4 grow">
            <Tabs defaultValue={tab} className="w-full">
              <TabsList>
                <TabsTrigger
                  onClick={() => handleChangeTab(PeopleTabs.OVERVIEW)}
                  value={PeopleTabs.OVERVIEW}
                >Overview</TabsTrigger>
                <TabsTrigger
                  onClick={() => handleChangeTab(PeopleTabs.STATS)}
                  value={PeopleTabs.STATS}
                >Stats</TabsTrigger>
                <TabsTrigger
                  onClick={() => handleChangeTab(PeopleTabs.CUBES)}
                  value={PeopleTabs.CUBES}
                >Cubes</TabsTrigger>
                <TabsTrigger
                  onClick={() => handleChangeTab(PeopleTabs.LAST_ACTIVITY)}
                  value={PeopleTabs.LAST_ACTIVITY}
                >Last activity</TabsTrigger>
              </TabsList>
              <TabsContent value={PeopleTabs.OVERVIEW}>
                <OverviewTabContent cubes={backup}/>
              </TabsContent>
              <TabsContent value={PeopleTabs.STATS}>Change your password here.</TabsContent>
              <TabsContent value={PeopleTabs.CUBES}>
                <CubesTabContent cubes={backup}/>
              </TabsContent>
              <TabsContent value={PeopleTabs.LAST_ACTIVITY}>
                <LastActivityTabContent cubes={backup}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

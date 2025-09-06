'use client';
import { useParams } from 'next/navigation';
import FadeIn from '@/components/fade-in/fade-in';
import { useUser } from '@/hooks/api/useUser';
import * as React from 'react';
import { useEffect } from 'react';
import { useBackup } from '@/hooks/api/useBackup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PeopleTabs } from '@/enums/PeopleTabs';
import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { Cube } from '@/interfaces/Cube';
import { importNexusTimerData } from '@/lib/importDataFromFile';
import LastActivityTabContent from '@/components/people/last-activity-tab-content';
import CubesTabContent from '@/components/people/cubes-tab-content';
import OverviewTabContent from '@/components/people/overview-tab-content';
import UserInfo from '@/components/people/user-info';
import { useSettingsModalStore } from '@/store/SettingsModalStore';
import useWebsiteColors from '@/hooks/useWebsiteColors';
import PeopleBreadcrumb from '@/components/people/people-breadcrumb';
import PeopleSkeleton from '@/components/people/people-skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const params = useParams<{ userId: string; }>()
  const userId = params.userId;
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { backup: backupString, isLoading: isLoadingBackup } = useBackup(userId);
  const [tab, setTab] = useQueryState(STATES.PEOPLE_PAGE.TAB_MODE.KEY, { defaultValue: STATES.PEOPLE_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [backup, setBackup] = React.useState<Cube[]>([]);
  const handleChangeTab = (value: PeopleTabs) => setTab(value);
  const settings = useSettingsModalStore(store => store.settings);
  const { applyColorTheme } = useWebsiteColors();

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
  }, [backupString]);

  useEffect(() => {
    applyColorTheme(settings.preferences.colorTheme);
  }, [applyColorTheme, settings.preferences.colorTheme]);

  if (isLoadingUser || isLoadingBackup) {
    return (
      <PeopleSkeleton/>
    );
  }

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/people" >
                    People
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{user.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row p-5 relative">
            <UserInfo user={user}/>
            <div className="flex flex-col ml-4 grow">
              <Tabs defaultValue={tab} className="w-full">
                <TabsList>
                  <TabsTrigger
                    onClick={() => handleChangeTab(PeopleTabs.OVERVIEW)}
                    value={PeopleTabs.OVERVIEW}
                  >Overview</TabsTrigger>
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
    </ScrollArea>
  )
}

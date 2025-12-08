import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar/>
      <SidebarInset className={'overflow-hidden relative'} style={{ height: 'calc(100dvh - 1rem)' }}>
        <StatisticsProvider>
          {children}
        </StatisticsProvider>
      </SidebarInset>
    </>
  )
}

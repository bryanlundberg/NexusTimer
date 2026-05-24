import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider'
import { MobileBottomNav } from '@/widgets/mobile-bottom-nav/ui/MobileBottomNav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className={'h-svh max-h-svh overflow-hidden relative'}>
        <StatisticsProvider>{children}</StatisticsProvider>
        <MobileBottomNav />
      </SidebarInset>
    </>
  )
}

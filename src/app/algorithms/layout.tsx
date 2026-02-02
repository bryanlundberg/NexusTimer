'use client'
import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className={'overflow-hidden'}>
        <StatisticsProvider>{children}</StatisticsProvider>
      </SidebarInset>
    </>
  )
}

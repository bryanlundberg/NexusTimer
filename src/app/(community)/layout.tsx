'use client'
import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import FloatButton from '@/features/compare-users/ui/FloatButton'
import CompareUsersModal from '@/features/compare-users/ui/compare-users-modal'
import StatisticsProvider from '@/components/statistics-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const users = useCompareUsersStore((state) => state.users)
  const isOpenOverlay = useCompareUsersStore((state) => state.isOpenOverlay)
  return (
    <>
      <AppSidebar/>
      <SidebarInset className={'overflow-hidden'} style={{ height: 'calc(100dvh - 1rem)' }}>
        <StatisticsProvider>
          {children}
          {users.length > 0 && <FloatButton/>}
          {isOpenOverlay && <CompareUsersModal/>}
        </StatisticsProvider>
      </SidebarInset>
    </>
  )
}

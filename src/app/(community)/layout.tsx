'use client'
import Providers from '@/components/providers'
import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import FloatButton from '@/components/people/FloatButton'
import { useCompareUsersStore } from '@/store/CompareUsers'
import CompareUsersModal from '@/components/people/compare-users-modal'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const users = useCompareUsersStore((state) => state.users)
  const isOpenOverlay = useCompareUsersStore((state) => state.isOpenOverlay)
  return (
    <>
      <AppSidebar />
      <SidebarInset className={'overflow-hidden'} style={{ height: 'calc(100dvh - 1rem)' }}>
        <Providers>
          {children}
          {users.length > 0 && <FloatButton />}
          {isOpenOverlay && <CompareUsersModal />}
        </Providers>
      </SidebarInset>
    </>
  )
}

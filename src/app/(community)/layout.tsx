'use client'
import Providers from '@/components/providers'
import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import FloatButton from '@/components/people/FloatButton'
import { useCompareUsersStore } from '@/store/CompareUsers'
import CompareUsersModal from '@/components/people/compare-users-modal'

export default function Layout({ children }: { children: React.ReactNode }) {
  const users = useCompareUsersStore((state) => state.users)
  const isOpenOverlay = useCompareUsersStore((state) => state.isOpenOverlay)
  return (
    <>
      <AppSidebar />
      <SidebarInset className={'overflow-hidden'} style={{ height: 'calc(100dvh - 1rem)' }}>
        <Providers loaderProvider={false}>
          {children}
          {users.length > 0 && <FloatButton />}
          {isOpenOverlay && <CompareUsersModal />}
        </Providers>
      </SidebarInset>
    </>
  )
}

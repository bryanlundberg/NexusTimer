'use client'
import Providers from '@/components/providers'
import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className={'overflow-hidden'} style={{ height: 'calc(100dvh - 1rem)' }}>
        <Providers>{children}</Providers>
      </SidebarInset>
    </>
  )
}

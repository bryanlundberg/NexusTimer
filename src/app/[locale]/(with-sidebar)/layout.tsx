import React, { Suspense } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider'
import { MobileBottomNav } from '@/widgets/mobile-bottom-nav/ui/MobileBottomNav'
import AppShellProviders from '@/components/app-shell-providers'
import { ChatDock } from '@/widgets/chat-dock/ui/ChatDock'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellProviders>
      <AppSidebar />
      <SidebarInset className={'h-svh max-h-svh overflow-hidden relative'}>
        <StatisticsProvider>
          <Suspense>{children}</Suspense>
        </StatisticsProvider>
        <MobileBottomNav />
      </SidebarInset>
      <ChatDock />
    </AppShellProviders>
  )
}

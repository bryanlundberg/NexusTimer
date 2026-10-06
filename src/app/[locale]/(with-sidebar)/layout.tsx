import React, { Suspense } from 'react'
import { getMessages } from 'next-intl/server'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider'
import { MobileBottomNav } from '@/widgets/mobile-bottom-nav/ui/MobileBottomNav'
import AppShellProviders from '@/components/app-shell-providers'
import { ChatDock } from '@/widgets/chat-dock/ui/ChatDock'
import { appMessages } from '@/shared/config/i18n/messageScopes'
import { MessagesScope } from '@/shared/ui/messages-scope/MessagesScope'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()

  return (
    <MessagesScope messages={appMessages(messages)}>
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
    </MessagesScope>
  )
}

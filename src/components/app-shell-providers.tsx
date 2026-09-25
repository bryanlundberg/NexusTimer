import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import AlertsProvider from '@/components/alerts-provider'
import PreloadAppProvider from '@/components/preload-app-provider'
import { Overlay } from '@/shared/ui/overlay/overlay'
import RealtimeProvider from '@/components/realtime-provider'

export default function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <SessionProvider>
        <RealtimeProvider />
        <SidebarProvider>
          <AlertsProvider>
            <PreloadAppProvider>
              {children}
              <Overlay />
            </PreloadAppProvider>
          </AlertsProvider>
        </SidebarProvider>
      </SessionProvider>
    </NuqsAdapter>
  )
}

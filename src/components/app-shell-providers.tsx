import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/shared/config/auth/auth'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import AlertsProvider from '@/components/alerts-provider'
import PreloadAppProvider from '@/components/preload-app-provider'
import { Overlay } from '@/shared/ui/overlay/overlay'

export default async function AppShellProviders({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <NuqsAdapter>
      <SessionProvider session={session}>
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

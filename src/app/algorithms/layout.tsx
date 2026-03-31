import React from 'react'
import type { Metadata } from 'next'
import { locales } from '@/shared/config/i18n/locales'
import { SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider'

export const metadata: Metadata = {
  alternates: {
    canonical: '/algorithms',
    languages: Object.fromEntries(locales.map((l) => [l, '/algorithms']))
  }
}

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

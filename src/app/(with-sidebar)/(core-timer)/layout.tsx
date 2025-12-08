import React from 'react'
import StatisticsProvider from '@/components/statistics-provider';
import BackgroundImageApp from '@/components/background-image-app';
import SyncBackupProvider from '@/components/sync-backup-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundImageApp>
        <SyncBackupProvider>
          <StatisticsProvider>
            {children}
          </StatisticsProvider>
        </SyncBackupProvider>
      </BackgroundImageApp>
    </>
  )
}

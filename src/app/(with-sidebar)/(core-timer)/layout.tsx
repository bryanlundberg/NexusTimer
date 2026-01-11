import React from 'react'
import StatisticsProvider from '@/components/statistics-provider'
import BackgroundImageApp from '@/components/background-image-app'
import SyncBackupProvider from '@/components/sync-backup-provider'
import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: {
      default: t('title'),
      template: '%s - Nexus Timer'
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: 'Nexus Timer',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: t('title')
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/opengraph-image.png']
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundImageApp>
        <SyncBackupProvider>
          <StatisticsProvider>{children}</StatisticsProvider>
        </SyncBackupProvider>
      </BackgroundImageApp>
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { OfflineView } from '@/shared/ui/offline/OfflineView'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Index.Offline')
  return {
    title: { absolute: `${t('title')} - Nexus Timer` },
    robots: { index: false }
  }
}

export default function OfflinePage() {
  return <OfflineView />
}

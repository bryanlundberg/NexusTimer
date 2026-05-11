import { getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerHistoryView from '@/features/trainer/ui/TrainerHistoryView'

export default async function TrainerHistoryPage() {
  const tTrainer = await getTranslations('Index.TrainerPage')
  const t = await getTranslations('Index.TrainerHistoryPage')
  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbPath={'/algorithms/trainer'}
        breadcrumb={tTrainer('breadcrumb')}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={t('breadcrumb')}
      />

      <TrainerHistoryView />
    </ScrollArea>
  )
}

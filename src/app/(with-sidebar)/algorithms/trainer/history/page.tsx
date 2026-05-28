import { getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerHistoryView from '@/features/trainer/ui/TrainerHistoryView'

export default async function TrainerHistoryPage() {
  const tTrainer = await getTranslations('Index.TrainerPage')
  const t = await getTranslations('Index.TrainerHistoryPage')
  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbs={[{ label: tTrainer('breadcrumb'), href: '/algorithms/trainer' }, { label: t('breadcrumb') }]}
        accentStripe
      />

      <PageBody variant="data">
        <TrainerHistoryView />
      </PageBody>
    </ScrollArea>
  )
}

import { getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import TrainerExperience from '@/features/trainer/ui/TrainerExperience'

export default async function TrainerPage() {
  const tAlgs = await getTranslations('Index.AlgorithmsPage')
  const t = await getTranslations('Index.TrainerPage')
  return (
    <div className="min-h-dvh flex flex-col">
      <CoreHeader
        breadcrumbs={[{ label: tAlgs('title'), href: '/algorithms' }, { label: t('breadcrumb') }]}
        accentStripe
      />

      <PageBody variant="data" className="flex-1 flex flex-col pt-0">
        <TrainerExperience />
      </PageBody>
    </div>
  )
}

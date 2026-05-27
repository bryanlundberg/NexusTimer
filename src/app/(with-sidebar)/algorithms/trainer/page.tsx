import { getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import TrainerExperience from '@/features/trainer/ui/TrainerExperience'

export default async function TrainerPage() {
  const tAlgs = await getTranslations('Index.AlgorithmsPage')
  const t = await getTranslations('Index.TrainerPage')
  return (
    <div className="min-h-dvh flex flex-col">
      <CoreHeader
        breadcrumbPath={'/algorithms'}
        breadcrumb={tAlgs('title')}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={t('breadcrumb')}
      />

      <TrainerExperience />
    </div>
  )
}

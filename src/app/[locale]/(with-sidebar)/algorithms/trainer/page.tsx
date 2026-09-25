import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import TrainerExperience from '@/features/trainer/ui/TrainerExperience'
import { localizedAlternates } from '@/shared/config/i18n/alternates'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    alternates: localizedAlternates(locale, '/algorithms/trainer')
  }
}

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

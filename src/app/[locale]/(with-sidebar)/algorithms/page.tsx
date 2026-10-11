'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import MethodsExplorer from '@/features/algorithm-method/ui/MethodsExplorer'
import SuggestAlgorithmButton from '@/features/suggest-algorithm/ui/SuggestAlgorithmButton'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { PageHeader } from '@/shared/ui/page-header/PageHeader'

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')

  return (
    <ScrollArea className="max-h-dvh overflow-auto" overscrollStretch>
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/algorithms' }]} />

      <PageBody variant="data" className="px-4 pb-4 pt-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
        <PageHeader title={t('title')} description={t('description')} />

        <MethodsExplorer />

        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-6">
          <SuggestAlgorithmButton
            methods={ALGORITHM_SETS.map((set) => ({
              slug: set.slug,
              title: set.title,
              puzzle: set.puzzle,
              caseNames: set.algorithms.map((a) => a.name)
            }))}
          />
          <Suggestions message={t('edit-github')} />
        </div>
      </PageBody>
    </ScrollArea>
  )
}

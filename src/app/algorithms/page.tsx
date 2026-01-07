'use client'
import _ from 'lodash'
import { ScrollArea } from '@/components/ui/scroll-area'
import AlgorithmsBreadcrumb from '@/widgets/algorithms-breadcrumb/ui/AlgorithmsBreadcrumb'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')
  const groupedSets = _.groupBy(ALGORITHM_SETS, 'puzzle')

  return (
    <ScrollArea className="p-4 max-h-dvh overflow-auto">
      <AlgorithmsBreadcrumb hideCollectionsSegment />

      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{t('header')}</h1>

      {Object.keys(groupedSets).length > 1 &&
        Object.entries(groupedSets).map(([cube, sets]) => (
          <section key={cube} className="py-8">
            <h2 className="px-2 mb-4 text-xl font-bold tracking-tight">{cube}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
              {sets.map((set) => (
                <AlgorithmMethod key={set.slug} set={set} />
              ))}
            </div>
          </section>
        ))}

      <Suggestions message={t('suggestions')} />
    </ScrollArea>
  )
}

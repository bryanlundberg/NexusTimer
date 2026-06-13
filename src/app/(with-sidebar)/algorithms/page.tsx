'use client'
import _ from 'lodash'
import { ScrollArea } from '@/components/ui/scroll-area'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')
  const groupedSets = _.groupBy(ALGORITHM_SETS, 'puzzle')

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/algorithms' }]} />

      <PageBody variant="data" className="px-4 pb-4 pt-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
        {/* Algorithm sets grouped by puzzle */}
        {Object.keys(groupedSets).length > 1 &&
          Object.entries(groupedSets).map(([cube, sets]) => (
            <section key={cube} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold tracking-tight">{cube}</h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground font-medium">
                  {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {sets.map((set) => (
                  <AlgorithmMethod key={set.slug} set={set} />
                ))}
              </div>
            </section>
          ))}

        <Suggestions message={t('suggestions')} />
      </PageBody>
    </ScrollArea>
  )
}

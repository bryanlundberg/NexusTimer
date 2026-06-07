'use client'
import _ from 'lodash'
import { ScrollArea } from '@/components/ui/scroll-area'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { BookOpen } from 'lucide-react'

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')
  const groupedSets = _.groupBy(ALGORITHM_SETS, 'puzzle')

  const totalAlgorithms = ALGORITHM_SETS.reduce((acc, set) => acc + set.algorithms.length, 0)
  const totalSets = ALGORITHM_SETS.length

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/algorithms' }]} />

      <PageBody variant="hero" className="px-4 pb-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
        {/* Hero section */}
        <div className="mb-8 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {t('title')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t('header')}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('description')}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-auto">
              <div className="rounded-lg border bg-card px-4 py-3 text-center md:text-left">
                <div className="text-2xl font-bold tabular-nums">{totalSets}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{t('title')}</div>
              </div>
              <div className="rounded-lg border bg-card px-4 py-3 text-center md:text-left">
                <div className="text-2xl font-bold tabular-nums">{totalAlgorithms}+</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Algorithms</div>
              </div>
              <div className="rounded-lg border bg-card px-4 py-3 text-center md:text-left">
                <div className="text-2xl font-bold tabular-nums">{Object.keys(groupedSets).length}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Puzzles</div>
              </div>
            </div>
          </div>
        </div>

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

'use client'
import _ from 'lodash'
import { ScrollArea } from '@/components/ui/scroll-area'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { BookOpen } from 'lucide-react'

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')
  const groupedSets = _.groupBy(ALGORITHM_SETS, 'puzzle')

  const totalAlgorithms = ALGORITHM_SETS.reduce((acc, set) => acc + set.algorithms.length, 0)
  const totalSets = ALGORITHM_SETS.length

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader breadcrumbPath={'/algorithms'} breadcrumb={t('title')} />

      <div className="p-4 md:p-8 lg:p-12">
        {/* Hero section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-primary/15 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{t('header')}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{t('description')}</p>
            <div className="flex items-center gap-6 mt-5">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">{totalSets}</span>
                <span className="text-xs text-muted-foreground">{t('title')}</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">{totalAlgorithms}+</span>
                <span className="text-xs text-muted-foreground">Algorithms</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">{Object.keys(groupedSets).length}</span>
                <span className="text-xs text-muted-foreground">Puzzles</span>
              </div>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/8 blur-xl" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sets.map((set) => (
                  <AlgorithmMethod key={set.slug} set={set} />
                ))}
              </div>
            </section>
          ))}

        <Suggestions message={t('suggestions')} />
      </div>
    </ScrollArea>
  )
}

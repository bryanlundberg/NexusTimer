'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleCaseVisual from '@/widgets/people/ui/people-case-visual'
import { buildLearnedMethods } from '@/entities/trainer-learned/lib/buildLearnedMethods'
import type { LearnedMethod } from '@/entities/trainer-learned/model/useUserLearned'
import RingMethod from '@/widgets/people/ui/ring-method'
import { useChartContrast } from '@/shared/model/useChartContrast'
import { scrollEdgesMask, useScrollEdges } from '@/shared/model/use-scroll-edges'

export default function AlgorithmsTabContent({ methods }: { methods?: LearnedMethod[] }) {
  const t = useTranslations('Index.PeoplePage.algorithms')
  const { total, byPuzzle } = useMemo(() => buildLearnedMethods(methods), [methods])

  const strokeClass = useChartContrast().stroke

  const orderedMethods = useMemo(() => byPuzzle.flatMap((group) => group.methods), [byPuzzle])

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const effectiveSlug = selectedSlug ?? orderedMethods[0]?.set.slug ?? null
  const selected = orderedMethods.find((m) => m.set.slug === effectiveSlug) ?? null

  const [stripRef, stripEdges] = useScrollEdges<HTMLDivElement>()
  const stripMask = scrollEdgesMask(stripEdges)

  if (total === 0) return <EmptyTabContent message={t('no-learned')} />

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={stripRef}
        style={{ maskImage: stripMask, WebkitMaskImage: stripMask }}
        className="flex snap-x gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden @xl/tab:flex-wrap @xl/tab:gap-3 @xl/tab:overflow-visible"
      >
        {orderedMethods.map((view) => (
          <RingMethod
            key={view.set.slug}
            view={view}
            selected={view.set.slug === effectiveSlug}
            onSelect={() => setSelectedSlug(view.set.slug)}
            strokeClass={strokeClass}
            className="shrink-0 snap-start"
          />
        ))}
      </div>

      {selected && (
        <section className="flex flex-col gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <h3 className="shrink-0 text-sm font-semibold">{selected.set.title}</h3>
            <span className="truncate text-xs text-muted-foreground">{selected.set.subtitle}</span>
            <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
              {selected.learnedCount}/{selected.total}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
            {selected.cases.map((item) => (
              <div key={item.id} className="surface surface-sm flex justify-center p-1">
                <PeopleCaseVisual set={selected.set} item={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

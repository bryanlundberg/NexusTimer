'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleCaseVisual from '@/widgets/people/ui/people-case-visual'
import { buildLearnedMethods } from '@/entities/trainer-learned/lib/buildLearnedMethods'
import type { LearnedMethod } from '@/entities/trainer-learned/model/useUserLearned'
import RingMethod from '@/widgets/people/ui/ring-method'

export default function AlgorithmsTabContent({ methods }: { methods?: LearnedMethod[] }) {
  const t = useTranslations('Index.PeoplePage.algorithms')
  const { total, byPuzzle } = useMemo(() => buildLearnedMethods(methods), [methods])

  const orderedMethods = useMemo(() => byPuzzle.flatMap((group) => group.methods), [byPuzzle])

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selected = orderedMethods.find((m) => m.set.slug === selectedSlug) ?? null

  if (total === 0) return <EmptyTabContent />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3">
        {orderedMethods.map((view) => (
          <RingMethod
            key={view.set.slug}
            view={view}
            selected={view.set.slug === selectedSlug}
            onSelect={() => setSelectedSlug(view.set.slug)}
          />
        ))}
      </div>

      {selected && (
        <>
          <div className="mb-3 flex items-baseline gap-2">
            <h3 className="text-sm font-semibold">{selected.set.title}</h3>
            <span className="text-xs text-muted-foreground">{selected.set.subtitle}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {selected.cases.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/70 bg-background p-2 shadow-sm">
                <PeopleCaseVisual set={selected.set} item={item} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

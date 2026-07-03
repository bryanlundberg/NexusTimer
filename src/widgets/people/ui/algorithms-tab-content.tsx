'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import PeopleCaseVisual from '@/widgets/people/ui/people-case-visual'
import { buildLearnedMethods } from '@/entities/trainer-learned/lib/buildLearnedMethods'
import type { LearnedMethod } from '@/entities/trainer-learned/model/useUserLearned'
import RingMethod from '@/widgets/people/ui/ring-method'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import type { Colors } from '@/shared/types/colors'

const CHART_STROKE: Record<Colors, string> = {
  green: 'stroke-violet-500',
  violet: 'stroke-emerald-500',
  blue: 'stroke-orange-500',
  orange: 'stroke-sky-500',
  red: 'stroke-emerald-500',
  rose: 'stroke-teal-500',
  yellow: 'stroke-violet-500',
  neutral: 'stroke-sky-500',
  amber: 'stroke-indigo-500',
  lime: 'stroke-fuchsia-500',
  emerald: 'stroke-rose-500',
  teal: 'stroke-orange-500',
  cyan: 'stroke-pink-500',
  sky: 'stroke-amber-500',
  indigo: 'stroke-lime-500',
  purple: 'stroke-yellow-500',
  fuchsia: 'stroke-emerald-500',
  pink: 'stroke-teal-500',
  slate: 'stroke-blue-500',
  zinc: 'stroke-violet-500',
  gray: 'stroke-orange-500',
  stone: 'stroke-sky-500'
}

export default function AlgorithmsTabContent({ methods }: { methods?: LearnedMethod[] }) {
  const t = useTranslations('Index.PeoplePage.algorithms')
  const { total, byPuzzle } = useMemo(() => buildLearnedMethods(methods), [methods])

  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const strokeClass = CHART_STROKE[colorTheme] ?? 'stroke-emerald-500'

  const orderedMethods = useMemo(() => byPuzzle.flatMap((group) => group.methods), [byPuzzle])

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const effectiveSlug = selectedSlug ?? orderedMethods[0]?.set.slug ?? null
  const selected = orderedMethods.find((m) => m.set.slug === effectiveSlug) ?? null

  if (total === 0) return <EmptyTabContent />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3">
        {orderedMethods.map((view) => (
          <RingMethod
            key={view.set.slug}
            view={view}
            selected={view.set.slug === effectiveSlug}
            onSelect={() => setSelectedSlug(view.set.slug)}
            strokeClass={strokeClass}
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
              <div key={item.id} className="rounded-xl border border-border/70 bg-background p-2">
                <PeopleCaseVisual set={selected.set} item={item} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

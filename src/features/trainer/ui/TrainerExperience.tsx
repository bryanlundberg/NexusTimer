'use client'

import { useMemo, useState } from 'react'
import _ from 'lodash'
import { Activity, BarChart3, AlertTriangle } from 'lucide-react'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import TrainerSessionHeader from '@/features/trainer/ui/TrainerSessionHeader'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerStatsPanel from '@/features/trainer/ui/TrainerStatsPanel'
import TrainerStatRow from '@/features/trainer/ui/TrainerStatRow'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'

const DEFAULT_SLUG = 'oll'

export default function TrainerExperience() {
  const [slug, setSlug] = useState<string>(DEFAULT_SLUG)
  const [caseIndex, setCaseIndex] = useState<number>(0)

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === slug) ?? ALGORITHM_SETS[0], [slug])

  const currentCase = set.algorithms[caseIndex] ?? set.algorithms[0]
  const currentAlg = currentCase?.algs[0]

  const vizConfig = useMemo(
    () =>
      _.merge(
        {
          visualization: 'experimental-2D-LL',
          background: 'none',
          controlPanel: 'none',
          experimentalStickering: 'OLL',
          experimentalSetupAnchor: 'end',
          experimentalDragInput: 'none'
        },
        set.virtualization,
        {
          puzzle: set.puzzle,
          alg: currentAlg?.moves ?? ''
        }
      ),
    [set, currentAlg]
  )

  const handleSelectMethod = (next: string) => {
    setSlug(next)
    setCaseIndex(0)
  }

  const handleSkip = () => {
    if (!set.algorithms.length) return
    setCaseIndex((i) => (i + 1) % set.algorithms.length)
  }

  const totalCases = set.algorithms.length
  const groupCount = useMemo(() => Object.keys(_.groupBy(set.algorithms, 'group')).length, [set])

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <TrainerMethodSelect value={set.slug} onChange={handleSelectMethod} />
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{set.title}</span>
          <span className="opacity-50 mx-2">·</span>
          <span>{totalCases} cases</span>
          <span className="opacity-50 mx-2">·</span>
          <span>{groupCount} groups</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <TrainerSessionHeader
            targetTime={'>2:00'}
            progressValue={Math.round(((caseIndex + 1) / Math.max(totalCases, 1)) * 100)}
            sessionCurrent={caseIndex + 1}
            sessionTotal={totalCases}
          />

          <TrainerCurrentCase
            caseGroup={currentCase?.group ?? ''}
            caseName={currentCase?.name ?? ''}
            lastDrilled={'—'}
            totalSolves={0}
            setup={currentCase?.setup ?? currentAlg?.moves ?? ''}
            currentTime={'0.00'}
            vizConfig={vizConfig}
            onSkip={handleSkip}
          />
        </div>

        <aside className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
          <TrainerStatsPanel title={'This case'} icon={<Activity />}>
            <TrainerStatRow label={'Name'} value={currentCase?.name ?? '—'} />
            <TrainerStatRow label={'Group'} value={currentCase?.group ?? '—'} />
            <TrainerStatRow label={'Variants'} value={String(currentCase?.algs.length ?? 0)} />
            <TrainerStatRow label={'Best'} value={'—'} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={'This session'} icon={<BarChart3 />}>
            <TrainerStatRow label={'Cases done'} value={`${caseIndex + 1} / ${totalCases}`} />
            <TrainerStatRow label={'Method'} value={set.title} />
            <TrainerStatRow label={'Puzzle'} value={set.puzzle} />
            <TrainerStatRow label={'Mistakes'} value={'0'} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={'Set overview'} icon={<AlertTriangle />}>
            <TrainerStatRow label={'Subtitle'} value={set.subtitle} />
            <TrainerStatRow label={'Difficulty'} value={String(set.difficulty)} />
            <TrainerStatRow label={'Total algs'} value={String(totalCases)} />
            <TrainerStatRow label={'Groups'} value={String(groupCount)} />
          </TrainerStatsPanel>
        </aside>
      </div>
    </div>
  )
}

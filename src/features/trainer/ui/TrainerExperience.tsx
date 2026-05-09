'use client'

import { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Activity, BarChart3, AlertTriangle, Target, ListChecks } from 'lucide-react'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import TrainerSessionHeader from '@/features/trainer/ui/TrainerSessionHeader'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerStatsPanel from '@/features/trainer/ui/TrainerStatsPanel'
import TrainerStatRow from '@/features/trainer/ui/TrainerStatRow'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerEditTargetModal from '@/features/trainer/ui/TrainerEditTargetModal'
import TrainerPickCasesModal from '@/features/trainer/ui/TrainerPickCasesModal'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { TwistyPlayer } from 'cubing/twisty'

const DEFAULT_SLUG = 'oll'
const DEFAULT_TARGET_SECONDS = 2

export default function TrainerExperience() {
  const [slug, setSlug] = useState<string>(DEFAULT_SLUG)
  const [caseIndex, setCaseIndex] = useState<number>(0)
  const [target, setTarget] = useState<number>(DEFAULT_TARGET_SECONDS)
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set())
  const { open } = useOverlayStore()

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === slug) ?? ALGORITHM_SETS[0], [slug])

  useEffect(() => {
    setPickedIds(new Set(set.algorithms.map((a) => a.id)))
    setCaseIndex(0)
  }, [set])

  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])

  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]
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
      ) as unknown as Partial<TwistyPlayer>,
    [set, currentAlg]
  )

  const handleSelectMethod = (next: string) => {
    setSlug(next)
  }

  const handleSkip = () => {
    if (!sessionCases.length) return
    setCaseIndex((i) => (i + 1) % sessionCases.length)
  }

  const handleOpenEditTarget = () => {
    open({
      id: 'trainer-edit-target',
      component: <TrainerEditTargetModal initial={target} onApply={setTarget} />
    })
  }

  const handleOpenPickCases = () => {
    open({
      id: 'trainer-pick-cases',
      component: (
        <TrainerPickCasesModal
          algorithms={set.algorithms}
          initialSelected={pickedIds}
          vizConfig={set.virtualization as unknown as Partial<TwistyPlayer>}
          puzzle={set.puzzle}
          onApply={(next) => {
            setPickedIds(next)
            setCaseIndex(0)
          }}
        />
      )
    })
  }

  const totalCases = sessionCases.length
  const totalSetCases = set.algorithms.length
  const groupCount = useMemo(() => Object.keys(_.groupBy(set.algorithms, 'group')).length, [set])

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <TrainerMethodSelect value={set.slug} onChange={handleSelectMethod} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenEditTarget}>
            <Target className="h-3.5 w-3.5" />
            Edit target
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenPickCases}>
            <ListChecks className="h-3.5 w-3.5" />
            Pick cases
            <span className="ml-1 text-muted-foreground">
              {totalCases}/{totalSetCases}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <TrainerSessionHeader
            targetTime={`<${target}s`}
            progressValue={Math.round(((caseIndex + 1) / Math.max(totalCases, 1)) * 100)}
            sessionCurrent={Math.min(caseIndex + 1, totalCases)}
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
            <TrainerStatRow label={'Target'} value={`<${target}s`} />
            <TrainerStatRow label={'Cases done'} value={`${Math.min(caseIndex + 1, totalCases)} / ${totalCases}`} />
            <TrainerStatRow label={'Method'} value={set.title} />
            <TrainerStatRow label={'Puzzle'} value={set.puzzle} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={'Set overview'} icon={<AlertTriangle />}>
            <TrainerStatRow label={'Subtitle'} value={set.subtitle} />
            <TrainerStatRow label={'Difficulty'} value={String(set.difficulty)} />
            <TrainerStatRow label={'Total algs'} value={String(totalSetCases)} />
            <TrainerStatRow label={'Groups'} value={String(groupCount)} />
          </TrainerStatsPanel>
        </aside>
      </div>
    </div>
  )
}

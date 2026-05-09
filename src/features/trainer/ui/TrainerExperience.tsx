'use client'

import { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Activity, BarChart3, Target, ListChecks } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
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
  // TODO: replace with real persistence once tracking is wired up
  const learnedCount = 0
  const learnedPct = totalSetCases > 0 ? Math.round((learnedCount / totalSetCases) * 100) : 0

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
            progressValue={learnedPct}
            sessionCurrent={learnedCount}
            sessionTotal={totalSetCases}
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
          <TrainerStatsPanel title={'Current case'} icon={<Activity />}>
            <TrainerStatRow label={'Status'} value={'Learning'} />
            <TrainerStatRow label={'Best'} value={'—'} />
            <TrainerStatRow label={'ao5'} value={'—'} />
            <TrainerStatRow label={'ao12'} value={'—'} />
            <TrainerStatRow label={'Total solves'} value={'0'} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={`${set.title} progress`} icon={<BarChart3 />}>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Algorithms learned</span>
                <span className="font-mono tabular-nums">
                  {learnedCount} / {totalSetCases}
                </span>
              </div>
              <Progress value={learnedPct} />
            </div>
            <TrainerStatRow label={'Best single'} value={'—'} />
            <TrainerStatRow label={'Best ao12'} value={'—'} />
            <TrainerStatRow label={'Total solves'} value={'0'} />
          </TrainerStatsPanel>
        </aside>
      </div>
    </div>
  )
}

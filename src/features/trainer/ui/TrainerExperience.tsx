'use client'

import { useMemo } from 'react'
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
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'

const formatMs = (ms: number) => (ms / 1000).toFixed(2)

export default function TrainerExperience() {
  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const caseIndex = useTrainerStore((s) => s.caseIndex)
  const targetSeconds = useTrainerStore((s) => s.targetSeconds)
  const elapsedMs = useTrainerStore((s) => s.elapsedMs)
  const caseStats = useTrainerStore((s) => s.caseStats)

  const setMethod = useTrainerStore((s) => s.setMethod)
  const setPickedIds = useTrainerStore((s) => s.setPickedIds)
  const setTargetSeconds = useTrainerStore((s) => s.setTargetSeconds)
  const nextCase = useTrainerStore((s) => s.nextCase)

  const { open } = useOverlayStore()

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0], [methodSlug])

  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])

  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]
  const currentAlg = currentCase?.algs[0]
  const currentStats = currentCase ? caseStats[currentCase.id] : undefined

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

  const handleSkip = () => nextCase(sessionCases.length)

  const handleOpenEditTarget = () => {
    open({
      id: 'trainer-edit-target',
      component: <TrainerEditTargetModal initial={targetSeconds} onApply={setTargetSeconds} />
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
          onApply={setPickedIds}
        />
      )
    })
  }

  const totalCases = sessionCases.length
  const totalSetCases = set.algorithms.length
  const learnedCount = useMemo(
    () => set.algorithms.reduce((acc, a) => acc + (caseStats[a.id]?.learned ? 1 : 0), 0),
    [set, caseStats]
  )
  const learnedPct = totalSetCases > 0 ? Math.round((learnedCount / totalSetCases) * 100) : 0

  const methodTotals = useMemo(() => {
    let totalSolves = 0
    let bestSingle: number | null = null
    for (const a of set.algorithms) {
      const s = caseStats[a.id]
      if (!s) continue
      totalSolves += s.totalSolves
      if (s.best !== null && (bestSingle === null || s.best < bestSingle)) {
        bestSingle = s.best
      }
    }
    return { totalSolves, bestSingle }
  }, [set, caseStats])

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <TrainerMethodSelect value={set.slug} onChange={setMethod} />
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
            targetTime={`<${targetSeconds}s`}
            progressValue={learnedPct}
            sessionCurrent={learnedCount}
            sessionTotal={totalSetCases}
          />

          <TrainerCurrentCase
            caseGroup={currentCase?.group ?? ''}
            caseName={currentCase?.name ?? ''}
            lastDrilled={'—'}
            totalSolves={currentStats?.totalSolves ?? 0}
            setup={currentCase?.setup ?? currentAlg?.moves ?? ''}
            currentTime={formatMs(elapsedMs)}
            vizConfig={vizConfig}
            onSkip={handleSkip}
          />
        </div>

        <aside className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
          <TrainerStatsPanel title={'Current case'} icon={<Activity />}>
            <TrainerStatRow label={'Status'} value={currentStats?.learned ? 'Learned' : 'Learning'} />
            <TrainerStatRow label={'Best'} value={currentStats?.best != null ? formatMs(currentStats.best) : '—'} />
            <TrainerStatRow label={'ao5'} value={currentStats?.ao5 != null ? formatMs(currentStats.ao5) : '—'} />
            <TrainerStatRow label={'ao12'} value={currentStats?.ao12 != null ? formatMs(currentStats.ao12) : '—'} />
            <TrainerStatRow label={'Total solves'} value={String(currentStats?.totalSolves ?? 0)} />
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
            <TrainerStatRow
              label={'Best single'}
              value={methodTotals.bestSingle != null ? formatMs(methodTotals.bestSingle) : '—'}
            />
            <TrainerStatRow label={'Total solves'} value={String(methodTotals.totalSolves)} />
          </TrainerStatsPanel>
        </aside>
      </div>
    </div>
  )
}

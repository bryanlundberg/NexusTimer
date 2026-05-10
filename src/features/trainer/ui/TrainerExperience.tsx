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
import TrainerRotationModeChips from '@/features/trainer/ui/TrainerRotationModeChips'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { TwistyPlayer } from 'cubing/twisty'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import useTimer from '@/features/timer/model/useTimer'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Cube } from '@/entities/cube/model/types'
import { Settings } from '@/shared/types/Settings'
import { useTrainerStats } from '@/features/trainer/model/useTrainerStats'
import { useTrainerSolves } from '@/features/trainer/model/useTrainerSolves'
import { postTrainerSolve } from '@/features/trainer/model/postTrainerSolve'
import { deleteTrainerSolve, patchTrainerSolve } from '@/features/trainer/model/mutateTrainerSolve'
import TrainerRecentSolves from '@/features/trainer/ui/TrainerRecentSolves'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

const formatMs = (ms: number) => (ms / 1000).toFixed(2)

export default function TrainerExperience() {
  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const caseIndex = useTrainerStore((s) => s.caseIndex)
  const targetSeconds = useTrainerStore((s) => s.targetSeconds)
  const caseStats = useTrainerStore((s) => s.caseStats)
  const rotationMode = useTrainerStore((s) => s.rotationMode)

  const timerStatus = useTimerStore((s) => s.timerStatus)
  const solvingTime = useTimerStore((s) => s.solvingTime)
  const isSolving = useTimerStore((s) => s.isSolving)
  const setTimerStatus = useTimerStore((s) => s.setTimerStatus)
  const setIsSolving = useTimerStore((s) => s.setIsSolving)
  const setSolvingTime = useTimerStore((s) => s.setSolvingTime)
  const settings = useSettingsStore((s) => s.settings)

  const setMethod = useTrainerStore((s) => s.setMethod)
  const setPickedIds = useTrainerStore((s) => s.setPickedIds)
  const setTargetSeconds = useTrainerStore((s) => s.setTargetSeconds)
  const setRotationMode = useTrainerStore((s) => s.setRotationMode)
  const advanceCase = useTrainerStore((s) => s.advanceCase)
  const recordSolve = useTrainerStore((s) => s.recordSolve)
  const hydrateMethodStats = useTrainerStore((s) => s.hydrateMethodStats)

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const { open } = useOverlayStore()

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0], [methodSlug])

  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])

  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]
  const currentAlg = currentCase?.algs[0]
  const currentStats = currentCase ? caseStats[currentCase.id] : undefined

  const { stats: serverStats, mutate: mutateStats } = useTrainerStats(methodSlug, isAuthed)
  const { learnedIds, mutate: mutateLearned } = useTrainerLearned(methodSlug, isAuthed)
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds])
  const {
    solves: recentSolves,
    isLoading: solvesLoading,
    mutate: mutateSolves
  } = useTrainerSolves(methodSlug, currentCase?.id, isAuthed)

  useEffect(() => {
    if (!isAuthed) return
    hydrateMethodStats(methodSlug, serverStats)
  }, [isAuthed, methodSlug, serverStats, hydrateMethodStats])

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

  const handleSkip = () => advanceCase(sessionCases.length)

  const trainerCubeStub = useMemo<Cube>(
    () => ({
      id: 'trainer',
      name: 'trainer',
      category: '3x3',
      solves: { session: [], all: [] },
      createdAt: 0,
      favorite: false
    }),
    []
  )

  const trainerSettings = useMemo<Settings>(
    () => ({
      ...settings,
      timer: { ...settings.timer, inspection: false, holdToStart: false }
    }),
    [settings]
  )

  useTimer({
    isSolving,
    setTimerStatus,
    selectedCube: trainerCubeStub,
    inspectionRequired: false,
    setIsSolving,
    setSolvingTime,
    timerMode: TimerMode.NORMAL,
    settings: trainerSettings,
    onFinishSolve: () => {
      if (!currentCase) return
      const ms = useTimerStore.getState().solvingTime
      if (ms <= 0) return
      const roundedMs = Math.round(ms)
      recordSolve(currentCase.id, roundedMs)
      const solvedCaseId = currentCase.id
      advanceCase(sessionCases.length)
      if (!isAuthed) return
      postTrainerSolve({ methodSlug, caseId: solvedCaseId, timeMs: roundedMs, penalty: 'OK' })
        .then(() => Promise.all([mutateStats(), mutateSolves()]))
        .catch((err) => {
          console.error('Failed to persist trainer solve:', err)
        })
    }
  })

  const handleToggleLearned = async () => {
    if (!currentCase || !isAuthed) return
    const wasLearned = learnedSet.has(currentCase.id)
    const nextLearned = !wasLearned
    const optimistic = new Set(learnedIds)
    if (nextLearned) optimistic.add(currentCase.id)
    else optimistic.delete(currentCase.id)
    mutateLearned({ caseIds: Array.from(optimistic) }, { revalidate: false })
    try {
      await setTrainerLearned({ methodSlug, caseId: currentCase.id, learned: nextLearned })
      await mutateLearned()
    } catch (err) {
      console.error('Failed to update learned:', err)
      mutateLearned()
    }
  }

  const handlePenaltyChange = async (id: string, penalty: 'OK' | '+2' | 'DNF') => {
    try {
      await patchTrainerSolve(id, penalty)
      await Promise.all([mutateStats(), mutateSolves()])
    } catch (err) {
      console.error('Failed to update solve penalty:', err)
    }
  }

  const handleDeleteSolve = async (id: string) => {
    try {
      await deleteTrainerSolve(id)
      await Promise.all([mutateStats(), mutateSolves()])
    } catch (err) {
      console.error('Failed to delete solve:', err)
    }
  }

  const timeColorClass =
    timerStatus === TimerStatus.HOLDING
      ? 'text-red-500'
      : timerStatus === TimerStatus.READY
        ? 'text-emerald-500'
        : 'text-foreground'

  const displayedTime =
    timerStatus === TimerStatus.HOLDING || timerStatus === TimerStatus.READY ? '0.00' : formatMs(solvingTime)

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
    () => set.algorithms.reduce((acc, a) => acc + (learnedSet.has(a.id) ? 1 : 0), 0),
    [set, learnedSet]
  )
  const learnedPct = totalSetCases > 0 ? Math.round((learnedCount / totalSetCases) * 100) : 0
  const currentIsLearned = !!currentCase && learnedSet.has(currentCase.id)

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

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rotation</span>
        <TrainerRotationModeChips value={rotationMode} onChange={setRotationMode} />
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
            currentTime={displayedTime}
            timeColorClass={timeColorClass}
            vizConfig={vizConfig}
            isLearned={currentIsLearned}
            onSkip={handleSkip}
            onToggleLearned={isAuthed ? handleToggleLearned : undefined}
          />

          {isAuthed && currentCase && (
            <TrainerRecentSolves
              solves={recentSolves}
              isLoading={solvesLoading}
              onChangePenalty={handlePenaltyChange}
              onDelete={handleDeleteSolve}
            />
          )}
        </div>

        <aside className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
          <TrainerStatsPanel title={'Current case'} icon={<Activity />}>
            <TrainerStatRow label={'Status'} value={currentIsLearned ? 'Learned' : 'Learning'} />
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

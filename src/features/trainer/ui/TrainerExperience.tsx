'use client'

import { useEffect, useMemo } from 'react'
import _ from 'lodash'
import { Target, ListChecks, BarChart3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerEditTargetModal from '@/features/trainer/ui/TrainerEditTargetModal'
import TrainerPickCasesModal from '@/features/trainer/ui/TrainerPickCasesModal'
import TrainerRotationModeChips from '@/features/trainer/ui/TrainerRotationModeChips'
import TrainerRecentSolves from '@/features/trainer/ui/TrainerRecentSolves'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'
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
import { useSession } from 'next-auth/react'
import { cn } from '@/shared/lib/utils'

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

  const handleSkip = () => advanceCase(sessionCases.length)

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

  const methodPanel = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Algorithms learned</span>
          <span className="font-mono tabular-nums">
            {learnedCount} / {totalSetCases}
          </span>
        </div>
        <Progress value={learnedPct} />
        <div className="text-right text-[10px] text-muted-foreground font-mono tabular-nums">{learnedPct}%</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricTile
          label="Best single"
          value={methodTotals.bestSingle != null ? formatMs(methodTotals.bestSingle) : '—'}
        />
        <MetricTile label="Total solves" value={String(methodTotals.totalSolves)} />
        <MetricTile label="Picked" value={`${totalCases}/${totalSetCases}`} />
        <MetricTile label="Target" value={`<${targetSeconds}s`} />
      </div>
    </div>
  )

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-3">
      {/* Top toolbar — single row, wraps on narrow screens */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-45">
          <TrainerMethodSelect value={set.slug} onChange={setMethod} />
        </div>
        <TrainerRotationModeChips value={rotationMode} onChange={setRotationMode} />
        <div className="flex items-center gap-1.5 ml-auto">
          <Button variant="outline" size="sm" className="h-8" onClick={handleOpenEditTarget}>
            <Target className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">&lt;{targetSeconds}s</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={handleOpenPickCases}>
            <ListChecks className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {totalCases}/{totalSetCases}
            </span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 lg:hidden" aria-label="Method stats">
                <BarChart3 className="h-3.5 w-3.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] sm:max-w-sm p-4">
              <SheetHeader className="px-0">
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {set.title}
                </SheetTitle>
              </SheetHeader>
              {methodPanel}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Slim learned-progress strip — replaces the bulky session header */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">Learned</span>
        <Progress value={learnedPct} className="h-1.5 flex-1" />
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
          {learnedCount}/{totalSetCases}
        </span>
      </div>

      {/* Stage + side panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className={cn('flex-1 min-w-0 flex flex-col gap-3 rounded-xl p-3 sm:p-4')}>
          <TrainerCurrentCase
            caseGroup={currentCase?.group ?? ''}
            caseName={currentCase?.name ?? ''}
            setup={currentCase?.setup ?? currentAlg?.moves ?? ''}
            currentTime={displayedTime}
            timeColorClass={timeColorClass}
            vizConfig={vizConfig}
            isLearned={currentIsLearned}
            best={currentStats?.best != null ? formatMs(currentStats.best) : undefined}
            ao5={currentStats?.ao5 != null ? formatMs(currentStats.ao5) : undefined}
            ao12={currentStats?.ao12 != null ? formatMs(currentStats.ao12) : undefined}
            totalSolves={currentStats?.totalSolves ?? 0}
            onSkip={handleSkip}
            onToggleLearned={isAuthed ? handleToggleLearned : undefined}
          />

          {isAuthed && currentCase && (
            <div className="border-t pt-3">
              <TrainerRecentSolves
                solves={recentSolves}
                isLoading={solvesLoading}
                onChangePenalty={handlePenaltyChange}
                onDelete={handleDeleteSolve}
              />
            </div>
          )}
        </div>

        <aside className="hidden lg:flex flex-col gap-3 w-72 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{set.title}</h3>
          </div>
          {methodPanel}
        </aside>
      </div>
    </div>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border bg-background/60 px-2.5 py-1.5">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-mono tabular-nums">{value}</span>
    </div>
  )
}

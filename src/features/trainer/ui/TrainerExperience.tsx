'use client'

import { useEffect, useMemo } from 'react'
import _ from 'lodash'
import { useTranslations } from 'next-intl'
import { BarChart3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerEditTargetModal from '@/features/trainer/ui/TrainerEditTargetModal'
import TrainerPickCasesModal from '@/features/trainer/ui/TrainerPickCasesModal'
import TrainerRotationModeChips from '@/features/trainer/ui/TrainerRotationModeChips'
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
import { useSession } from 'next-auth/react'
import { cn } from '@/shared/lib/utils'

const formatMs = (ms: number) => (ms / 1000).toFixed(2)

export default function TrainerExperience() {
  const t = useTranslations('Index.TrainerPage')
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
  const { solves: recentSolves, mutate: mutateSolves } = useTrainerSolves(methodSlug, currentCase?.id, isAuthed)

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

  const timeColorClass =
    timerStatus === TimerStatus.HOLDING
      ? 'text-red-500'
      : timerStatus === TimerStatus.READY
        ? 'text-green-500'
        : 'text-foreground'

  const stageOverlayClass =
    timerStatus === TimerStatus.HOLDING
      ? 'bg-red-500/10'
      : timerStatus === TimerStatus.READY
        ? 'bg-primary/10'
        : 'bg-transparent'

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
          <span className="text-muted-foreground">{t('stats.algorithmsLearned')}</span>
          <span className="font-mono tabular-nums">
            {learnedCount} / {totalSetCases}
          </span>
        </div>
        <Progress value={learnedPct} />
        <div className="text-right text-[10px] text-muted-foreground font-mono tabular-nums">{learnedPct}%</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricTile
          label={t('stats.bestSingle')}
          value={methodTotals.bestSingle != null ? formatMs(methodTotals.bestSingle) : '—'}
        />
        <MetricTile label={t('stats.totalSolves')} value={String(methodTotals.totalSolves)} />
        <MetricTile label={t('stats.picked')} value={`${totalCases}/${totalSetCases}`} />
        <MetricTile label={t('stats.target')} value={`<${targetSeconds}s`} />
      </div>

      <LastAttemptsSparkline
        solves={recentSolves}
        targetMs={targetSeconds * 1000}
        title={t('stats.lastAttempts')}
        emptyLabel={t('stats.noDataYet')}
      />
    </div>
  )

  return (
    <div id="touch" className="px-2 flex flex-col gap-3 flex-1 relative">
      <div className={cn('absolute inset-0 pointer-events-none transition-colors duration-150', stageOverlayClass)} />
      {/* Top toolbar — method select + rotation chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-0 max-w-sm">
          <TrainerMethodSelect value={set.slug} onChange={setMethod} />
        </div>
        <TrainerRotationModeChips value={rotationMode} onChange={setRotationMode} />
      </div>

      {/* Slim learned-progress strip — hidden on lg+ where the side panel shows it */}
      <div className="flex items-center gap-3 lg:hidden">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{t('learned')}</span>
        <Progress value={learnedPct} className="h-1.5 flex-1" />
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
          {learnedCount}/{totalSetCases}
        </span>
      </div>

      {/* Stage + side panel */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        <div className="flex-1 min-w-0 h-fit flex flex-col gap-3 rounded-xl py-1 p-2">
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
            historyHref={isAuthed && currentCase ? '/algorithms/trainer/history' : undefined}
            targetSeconds={targetSeconds}
            onEditTarget={handleOpenEditTarget}
            pickedCount={totalCases}
            totalCount={totalSetCases}
            onPickCases={handleOpenPickCases}
          />

          {/* Stats sheet trigger — only on screens without the side panel */}
          <div className="lg:hidden mt-auto pt-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full h-9">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>{t('methodStats')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-4 max-h-[80vh] overflow-y-auto">
                <SheetHeader className="px-0">
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {set.title}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-2">{methodPanel}</div>
              </SheetContent>
            </Sheet>
          </div>
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

function LastAttemptsSparkline({
  solves,
  targetMs,
  title,
  emptyLabel
}: {
  solves: { _id: string; timeMs: number; penalty: 'OK' | '+2' | 'DNF' }[]
  targetMs: number
  title: string
  emptyLabel: string
}) {
  const ordered = [...solves].reverse()
  const validTimes = ordered.filter((s) => s.penalty !== 'DNF').map((s) => s.timeMs + (s.penalty === '+2' ? 2000 : 0))
  const max = validTimes.length > 0 ? Math.max(...validTimes) : 1
  const min = validTimes.length > 0 ? Math.min(...validTimes) : 0
  const range = Math.max(max - min, 1)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="text-[10px] font-semibold uppercase tracking-wider">{title}</span>
        <span className="text-[10px] ml-auto">{ordered.length}</span>
      </div>
      <div className="flex items-end gap-0.75 h-12 rounded-md bg-background/60 px-2 py-1.5">
        {ordered.length === 0 ? (
          <span className="text-[10px] text-muted-foreground self-center mx-auto">{emptyLabel}</span>
        ) : (
          ordered.map((s) => {
            if (s.penalty === 'DNF') {
              return <div key={s._id} className="flex-1 min-w-0.75 h-full rounded-sm bg-red-500/40" />
            }
            const adjusted = s.timeMs + (s.penalty === '+2' ? 2000 : 0)
            const ratio = (adjusted - min) / range
            const heightPct = Math.max(12, Math.round(ratio * 90 + 10))
            const colorClass =
              adjusted <= targetMs
                ? 'bg-emerald-500/70'
                : adjusted <= targetMs * 1.25
                  ? 'bg-amber-500/70'
                  : 'bg-red-500/70'
            return (
              <div
                key={s._id}
                className={cn('flex-1 min-w-0.75 rounded-sm', colorClass)}
                style={{ height: `${heightPct}%` }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

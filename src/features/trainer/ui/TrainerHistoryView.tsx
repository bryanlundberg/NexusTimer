'use client'

import { useMemo } from 'react'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerSolveHistoryTable from '@/features/trainer/ui/TrainerSolveHistoryTable'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerSolvesPaginated } from '@/features/trainer/model/useTrainerSolvesPaginated'
import { useTrainerStats } from '@/features/trainer/model/useTrainerStats'
import { deleteTrainerSolve, patchTrainerSolve } from '@/features/trainer/model/mutateTrainerSolve'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { TwistyPlayer } from 'cubing/twisty'

export default function TrainerHistoryView() {
  const t = useTranslations('Index.TrainerHistoryPage')
  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const caseIndex = useTrainerStore((s) => s.caseIndex)
  const setMethod = useTrainerStore((s) => s.setMethod)

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0], [methodSlug])
  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])
  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]

  const caseById = useMemo(() => {
    const map = new Map<string, AlgorithmCollection>()
    for (const a of set.algorithms) map.set(a.id, a)
    return map
  }, [set])

  const currentVizConfig = useMemo(() => {
    if (!currentCase) return null
    return _.merge(
      {
        visualization: 'experimental-2D-LL',
        background: 'none',
        controlPanel: 'none',
        experimentalStickering: 'OLL',
        experimentalSetupAnchor: 'end',
        experimentalDragInput: 'none'
      },
      set.virtualization,
      { puzzle: set.puzzle, alg: currentCase.algs?.[0]?.moves ?? '' }
    ) as unknown as Partial<TwistyPlayer>
  }, [currentCase, set])

  const { mutate: mutateStats } = useTrainerStats(methodSlug, isAuthed)
  const caseQuery = useTrainerSolvesPaginated(methodSlug, currentCase?.id, isAuthed)
  const methodQuery = useTrainerSolvesPaginated(methodSlug, null, isAuthed)

  const handlePenaltyChange = async (id: string, penalty: 'OK' | '+2' | 'DNF') => {
    try {
      await patchTrainerSolve(id, penalty)
      await Promise.all([mutateStats(), caseQuery.mutate(), methodQuery.mutate()])
    } catch (err) {
      console.error('Failed to update solve penalty:', err)
    }
  }

  const handleDeleteSolve = async (id: string) => {
    try {
      await deleteTrainerSolve(id)
      await Promise.all([mutateStats(), caseQuery.mutate(), methodQuery.mutate()])
    } catch (err) {
      console.error('Failed to delete solve:', err)
    }
  }

  if (!isAuthed) {
    return <div className="p-4 text-sm text-muted-foreground">{t('signInPrompt')}</div>
  }

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-4 max-w-3xl">
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/algorithms/trainer">
          <Button variant="outline" size="sm" className="h-8">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backToPractice')}
          </Button>
        </Link>
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{set.title}</h3>
        <div className="ml-auto min-w-0 max-w-[12rem]">
          <TrainerMethodSelect value={set.slug} onChange={setMethod} />
        </div>
      </div>

      <Tabs defaultValue="method" className="flex flex-col gap-3">
        <TabsList className="self-start">
          <TabsTrigger value="method">{t('tabs.method')}</TabsTrigger>
          <TabsTrigger value="case">{t('tabs.currentCase')}</TabsTrigger>
        </TabsList>

        <TabsContent value="method">
          <TrainerSolveHistoryTable
            solves={methodQuery.solves}
            isLoading={methodQuery.isLoading}
            isLoadingMore={methodQuery.isLoadingMore}
            reachedEnd={methodQuery.reachedEnd}
            onLoadMore={methodQuery.loadMore}
            onChangePenalty={handlePenaltyChange}
            onDelete={handleDeleteSolve}
            showCase
            caseById={caseById}
            puzzle={set.puzzle}
            vizDefaults={set.virtualization as Record<string, unknown>}
            emptyLabel={t('emptyMethod')}
          />
        </TabsContent>

        <TabsContent value="case" className="flex flex-col gap-3">
          {currentCase ? (
            <>
              <div className="flex items-center gap-3 rounded-lg border bg-card/40 p-3">
                <div className="size-14 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center shrink-0">
                  {currentVizConfig ? <AlgorithmRender config={currentVizConfig} width={56} height={56} /> : null}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {currentCase.group}
                  </span>
                  <span className="text-sm font-semibold truncate">{currentCase.name}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {caseQuery.solves.length} {caseQuery.reachedEnd ? t('total') : t('loaded')}
                  </span>
                </div>
              </div>

              <TrainerSolveHistoryTable
                solves={caseQuery.solves}
                isLoading={caseQuery.isLoading}
                isLoadingMore={caseQuery.isLoadingMore}
                reachedEnd={caseQuery.reachedEnd}
                onLoadMore={caseQuery.loadMore}
                onChangePenalty={handlePenaltyChange}
                onDelete={handleDeleteSolve}
                emptyLabel={t('emptyCase')}
              />
            </>
          ) : (
            <p className="text-xs text-muted-foreground py-1">{t('noCaseSelected')}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

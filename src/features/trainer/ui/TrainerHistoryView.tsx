'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Layers, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import AnimatedTabsList from '@/shared/ui/animated-tabs/AnimatedTabsList'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerMethodOverview from '@/features/trainer/ui/TrainerMethodOverview'
import TrainerSolveHistoryTable from '@/features/trainer/ui/TrainerSolveHistoryTable'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerSession } from '@/features/trainer/model/useTrainerSession'
import { useTrainerSolvesPaginated } from '@/features/trainer/model/useTrainerSolvesPaginated'
import { useTrainerStats } from '@/features/trainer/model/useTrainerStats'
import { deleteTrainerSolve } from '@/features/trainer/model/mutateTrainerSolve'
import { buildVizConfig } from '@/features/trainer/lib/trainerUtils'
import { TRAINER_DEFAULT_TARGET_SECONDS } from '@/features/trainer/lib/constants'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export default function TrainerHistoryView() {
  const t = useTranslations('Index.TrainerHistoryPage')

  const { set, currentCase } = useTrainerSession()
  const methodSlug = set.slug
  const setMethod = useTrainerStore((s) => s.setMethod)
  const targetSeconds = useTrainerStore((s) => s.targetByMethod[s.methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS)

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const [tab, setTab] = useState('method')

  const caseById = useMemo(() => {
    const map = new Map<string, AlgorithmCollection>()
    for (const a of set.algorithms) map.set(a.id, a)
    return map
  }, [set])

  const currentVizConfig = useMemo(() => {
    if (!currentCase) return null
    return buildVizConfig(set.puzzle, currentCase.algs?.[0]?.moves ?? '', set.virtualization as Record<string, unknown>)
  }, [currentCase, set])

  const { stats, isLoading: statsLoading, mutate: mutateStats } = useTrainerStats(methodSlug, isAuthed)
  const caseQuery = useTrainerSolvesPaginated(methodSlug, currentCase?.id, isAuthed)
  const methodQuery = useTrainerSolvesPaginated(methodSlug, null, isAuthed)

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
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{set.title}</h3>
        <div className="ml-auto min-w-0 max-w-48">
          <TrainerMethodSelect value={set.slug} onChange={setMethod} />
        </div>
      </div>

      <TrainerMethodOverview set={set} stats={stats} targetMs={targetSeconds * 1000} isLoading={statsLoading} />

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col gap-3">
        <AnimatedTabsList
          items={[
            { value: 'method', icon: Layers, label: t('tabs.method') },
            { value: 'case', icon: Target, label: t('tabs.currentCase') }
          ]}
          activeValue={tab}
          layoutId="trainer-history-tab-indicator"
        />

        <TabsContent value="method">
          <TrainerSolveHistoryTable
            solves={methodQuery.solves}
            isLoading={methodQuery.isLoading}
            isLoadingMore={methodQuery.isLoadingMore}
            reachedEnd={methodQuery.reachedEnd}
            onLoadMore={methodQuery.loadMore}
            onDelete={handleDeleteSolve}
            showCase
            caseById={caseById}
            puzzle={set.puzzle}
            vizDefaults={set.virtualization as Record<string, unknown>}
            emptyLabel={t('emptyMethod')}
            targetMs={targetSeconds * 1000}
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
                onDelete={handleDeleteSolve}
                emptyLabel={t('emptyCase')}
                targetMs={targetSeconds * 1000}
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

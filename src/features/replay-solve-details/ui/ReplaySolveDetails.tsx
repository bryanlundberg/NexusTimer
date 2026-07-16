'use client'

import { useState } from 'react'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import dynamic from 'next/dynamic'
import formatTime from '@/shared/lib/formatTime'
import { useTranslations } from 'next-intl'
import { useReplaySolveDetails } from '@/features/replay-solve-details/model/useReplaySolveDetails'
import { Stat } from '@/features/replay-solve-details/ui/Stat'
import { Field } from '@/features/replay-solve-details/ui/Field'
import { Clock, RotateCw, Zap } from 'lucide-react'

const RealtimeReplayPlayer = dynamic(
  () => import('@/features/solve-replay/ui/RealtimeReplayPlayer').then((m) => m.RealtimeReplayPlayer),
  { ssr: false }
)

enum Tab {
  Replay = 'replay',
  Solution = 'solution'
}

export function ReplaySolveDetails() {
  const t = useTranslations('Index.leaderboard-solve-details')
  const { metadata, replay, hasReplay, tps, moveCount, simplifiedSolution, markers } = useReplaySolveDetails()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Replay)

  if (!metadata) return null

  return (
    <DialogContent className="flex max-h-[80dvh] flex-col gap-3 overflow-y-auto p-5 sm:max-w-sm">
      <DialogTitle className="flex items-center justify-between gap-2 text-base leading-none">
        <span>{t('user-solution')}</span>
        <CategoryBadge category={metadata.puzzle} className="h-5 shrink-0 px-1.5 text-[10px]" />
      </DialogTitle>
      <DialogDescription className="sr-only">{metadata.scramble}</DialogDescription>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="gap-3">
        <ScrollableUnderlineTabs
          items={Object.values(Tab).map((tab) => ({ value: tab, label: t(tab) }))}
          activeValue={activeTab}
          layoutId="replay-solve-tab-indicator"
        />

        <TabsContent value={Tab.Replay} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<Clock className="size-3" />} label={t('time')} value={formatTime(metadata.time)} />
            <Stat icon={<RotateCw className="size-3" />} label={t('moves')} value={moveCount ?? '—'} />
            <Stat icon={<Zap className="size-3" />} label={t('tps')} value={tps ?? '—'} />
          </div>
          {hasReplay && <RealtimeReplayPlayer replay={replay!} markers={markers} />}
        </TabsContent>

        <TabsContent value={Tab.Solution} className="flex flex-col gap-3">
          <Field label={t('scramble')} value={metadata.scramble} />
          {simplifiedSolution && <Field label={t('solution')} value={simplifiedSolution} />}
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}

'use client'

import { useState } from 'react'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import formatTime from '@/shared/lib/formatTime'
import { useTranslations } from 'next-intl'
import { useReplaySolveDetails } from '@/features/replay-solve-details/model/useReplaySolveDetails'
import { Stat } from '@/features/replay-solve-details/ui/Stat'
import { Field } from '@/features/replay-solve-details/ui/Field'

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
        <Badge variant="outline" className="h-5 shrink-0 px-1.5 font-mono text-[10px]">
          {metadata.puzzle}
        </Badge>
      </DialogTitle>
      <DialogDescription className="sr-only">{metadata.scramble}</DialogDescription>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="gap-3">
        <TabsList className="grid w-full grid-cols-2">
          {Object.values(Tab).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="replay-solve-tab-indicator"
                  className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{t(tab)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={Tab.Replay} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border bg-muted/30">
            <Stat label={t('time')} value={formatTime(metadata.time)} />
            <Stat label={t('moves')} value={moveCount ?? '—'} />
            <Stat label={t('tps')} value={tps ?? '—'} />
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

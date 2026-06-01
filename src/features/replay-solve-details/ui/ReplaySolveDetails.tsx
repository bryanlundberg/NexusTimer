'use client'

import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/ui/shadcn-io/tabs'
import { Badge } from '@/components/ui/badge'
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

export function ReplaySolveDetails() {
  const t = useTranslations('Index.leaderboard-solve-details')
  const { metadata, replay, hasReplay, tps, moveCount, simplifiedSolution, markers } = useReplaySolveDetails()

  if (!metadata) return null

  return (
    <DialogContent className="flex flex-col gap-3 p-5 sm:max-w-sm">
      <DialogTitle className="flex items-center justify-between gap-2 text-base leading-none">
        <span>{t('user-solution')}</span>
        <Badge variant="outline" className="h-5 shrink-0 px-1.5 font-mono text-[10px]">
          {metadata.puzzle}
        </Badge>
      </DialogTitle>
      <DialogDescription className="sr-only">{metadata.scramble}</DialogDescription>

      <Tabs defaultValue="replay" className="gap-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="replay">{t('replay')}</TabsTrigger>
          <TabsTrigger value="solution">{t('solution')}</TabsTrigger>
        </TabsList>

        <TabsContents>
          <TabsContent value="replay" className="flex flex-col gap-4">
            <div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border bg-muted/30">
              <Stat label={t('time')} value={formatTime(metadata.time)} />
              <Stat label={t('moves')} value={moveCount ?? '—'} />
              <Stat label={t('tps')} value={tps ?? '—'} />
            </div>
            {hasReplay && <RealtimeReplayPlayer replay={replay!} markers={markers} />}
          </TabsContent>

          <TabsContent value="solution" className="flex flex-col gap-3">
            <Field label={t('scramble')} value={metadata.scramble} />
            {simplifiedSolution && <Field label={t('solution')} value={simplifiedSolution} />}
          </TabsContent>
        </TabsContents>
      </Tabs>
    </DialogContent>
  )
}

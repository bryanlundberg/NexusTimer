'use client'

import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'
import formatTime from '@/shared/lib/formatTime'
import calcTurnsPerSecond from '@/shared/lib/statistics/calcTurnsPerSecond'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useTranslations } from 'next-intl'
import type { SolveReplay } from '@/entities/replay/model/types'

const RealtimeReplayPlayer = dynamic(
  () => import('@/features/solve-replay/ui/RealtimeReplayPlayer').then((m) => m.RealtimeReplayPlayer),
  { ssr: false }
)

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-2.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <p className="rounded-md bg-muted/40 px-2.5 py-2 font-mono text-xs leading-relaxed break-words text-foreground/90">
        {value}
      </p>
    </div>
  )
}

export function ReplaySolveDetails() {
  const t = useTranslations('Index.leaderboard-solve-details')
  const { activeOverlay } = useOverlayStore()
  const { metadata } = activeOverlay || {}
  if (!metadata) return null

  const replay = metadata.replay as SolveReplay | undefined
  const hasReplay = Boolean(replay && replay.moves.length > 0)

  const tps = metadata.solution ? calcTurnsPerSecond(metadata.solution, metadata.time) : null
  const moveCount = metadata.solution
    ? metadata.solution.trim().split(/\s+/).filter(Boolean).length
    : replay?.moves.length

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

        <TabsContent value="replay" className="flex flex-col gap-4">
          <div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border bg-muted/30">
            <Stat label={t('time')} value={formatTime(metadata.time)} />
            <Stat label={t('moves')} value={moveCount ?? '—'} />
            <Stat label={t('tps')} value={tps ?? '—'} />
          </div>
          {hasReplay && <RealtimeReplayPlayer replay={replay!} />}
        </TabsContent>

        <TabsContent value="solution" className="flex flex-col gap-3">
          <Field label={t('scramble')} value={metadata.scramble} />
          {metadata.solution && <Field label={t('solution')} value={metadata.solution} />}
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}

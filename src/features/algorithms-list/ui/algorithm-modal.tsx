'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Badge } from '@/components/ui/badge'
import { buildAlgorithmReplay } from '@/features/solve-replay/lib/buildAlgorithmReplay'

const RealtimeReplayPlayer = dynamic(
  () => import('@/features/solve-replay/ui/RealtimeReplayPlayer').then((m) => m.RealtimeReplayPlayer),
  { ssr: false }
)

const TEMPO_SCALE = 1
const MOVE_MS = 1100

export default function AlgorithmModal() {
  const metadata = useOverlayStore((s) => s.activeOverlay?.metadata)
  const alg = metadata?.alg as string | undefined
  const cube = (metadata?.cube as string | undefined) || '3x3'

  const replay = useMemo(() => (alg ? buildAlgorithmReplay(alg, cube, MOVE_MS) : null), [alg, cube])

  if (!metadata || !alg || !replay) return null

  return (
    <DialogContent className="flex max-h-[80dvh] flex-col items-center gap-5 overflow-y-auto p-5 sm:max-w-sm">
      <div className="flex flex-col items-center gap-2">
        <DialogTitle className="text-lg font-semibold">{metadata.name}</DialogTitle>
        <Badge variant="outline" className="badge-notch text-xs">
          {cube}
        </Badge>
      </div>
      <DialogDescription className="sr-only">{alg}</DialogDescription>

      <RealtimeReplayPlayer replay={replay} size={260} tempoScale={TEMPO_SCALE} />

      <div className="notch-bl-tr [--nblt:14px] w-full border border-border bg-black p-3 sm:p-4 text-center text-white">
        <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider block mb-1.5">Algorithm</span>
        <code className="text-sm sm:text-base font-mono break-all">{alg}</code>
      </div>
    </DialogContent>
  )
}

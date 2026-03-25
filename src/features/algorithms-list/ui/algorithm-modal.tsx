import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as React from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { Badge } from '@/components/ui/badge'

export default function AlgorithmModal() {
  const { activeOverlay } = useOverlayStore()
  if (!activeOverlay?.metadata || !activeOverlay?.metadata?.alg || !activeOverlay?.metadata?.cube) return null

  return (
    <DialogContent className="flex flex-col justify-center items-center gap-6 overflow-auto">
      <div className="flex flex-col items-center gap-2">
        <DialogTitle className="text-lg font-semibold">{activeOverlay?.metadata?.name}</DialogTitle>
        <Badge variant="outline" className="text-xs">
          {activeOverlay?.metadata?.cube}
        </Badge>
      </div>

      <div className="rounded-xl bg-muted/30 p-3 size-fit flex items-center justify-center w-full aspect-square max-w-[300px]">
        <AlgorithmRender
          config={
            {
              alg: activeOverlay?.metadata?.alg || '',
              experimentalDragInput: 'none',
              tempoScale: 1,
              experimentalSetupAnchor: 'end',
              puzzle: activeOverlay?.metadata?.cube || '3x3',
              background: 'none'
            } as unknown as TwistyPlayer
          }
          width={300}
          height={300}
        />
      </div>

      <div className="w-full rounded-lg border bg-muted/20 p-3 sm:p-4 text-center">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block mb-1.5">
          Algorithm
        </span>
        <code className="text-sm sm:text-base font-mono break-all">{activeOverlay?.metadata?.alg}</code>
      </div>
    </DialogContent>
  )
}

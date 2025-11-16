import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as React from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'

export default function AlgorithmModal() {
  const { activeOverlay } = useOverlayStore()
  if (!activeOverlay?.metadata || !activeOverlay?.metadata?.alg || !activeOverlay?.metadata?.cube) return null

  return (
    <DialogContent className={'flex flex-col justify-center items-center gap-4'}>
      <DialogTitle>{activeOverlay?.metadata?.name}</DialogTitle>
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
        width={400}
        height={400}
      />

      <div className={'text-lg'}>{activeOverlay?.metadata?.alg}</div>
    </DialogContent>
  )
}

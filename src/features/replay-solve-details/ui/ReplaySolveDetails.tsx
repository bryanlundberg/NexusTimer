'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useLeaderboardSolveModal } from '@/store/LeaderboardSolveModal'
import AlgorithmRender from '@/components/twisty/AlgorithmRender'
import * as React from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import formatTime from '@/shared/lib/formatTime'
import calcTurnsPerSecond from '@/lib/calcTurnsPerSecond'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

export function ReplaySolveDetails() {
  const {
    activeOverlay: { metadata }
  } = useOverlayStore()

  return (
    <DialogContent className={'flex flex-col justify-center items-center gap-4'}>
      <DialogTitle>User solution</DialogTitle>
      <AlgorithmRender
        config={
          {
            alg: metadata.solution || metadata.scramble || '',
            experimentalDragInput: 'none',
            tempoScale: metadata.solution ? metadata.solution.split(' ').length / (metadata.time / 1000) : 1,
            experimentalSetupAnchor: 'end',
            puzzle: metadata.puzzle || '3x3x3',
            background: 'none'
          } as unknown as TwistyPlayer
        }
        width={400}
        height={400}
      />

      <div className="flex flex-col gap-2 items-center">
        <div className="text-lg font-bold">
          Time: {formatTime(metadata.time)}{' '}
          {metadata.solution ? '(' + calcTurnsPerSecond(metadata.solution, metadata.time) + 'tps)' : ''}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Scramble:</strong> {metadata.scramble}
          </p>
          {metadata.solution && (
            <p>
              <strong>Solution:</strong> {metadata.solution}
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  )
}

"use client";

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLeaderboardSolveModal } from '@/store/LeaderboardSolveModal';
import AlgorithmRender from '@/components/twisty/AlgorithmRender';
import * as React from 'react';
import { TwistyPlayer } from 'cubing/twisty';
import formatTime from '@/lib/formatTime';

export function LeaderboardSolveModal() {
  const isOpen = useLeaderboardSolveModal(state => state.isOpen);
  const setIsOpen = useLeaderboardSolveModal(state => state.setIsOpen);
  const solve = useLeaderboardSolveModal(state => state.solve);
  if (!solve) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={'flex flex-col justify-center items-center gap-4'}>
        <DialogTitle>User solution</DialogTitle>
        <AlgorithmRender
          config={{
            alg: solve.solution || solve.scramble || '',
            experimentalDragInput: 'none',
            tempoScale: solve.solution ? (solve.solution.split(' ').length / (solve.time / 1000)) : 1,
            experimentalSetupAnchor: 'end',
            puzzle: solve.puzzle || '3x3x3',
            background: 'none',
          } as unknown as TwistyPlayer}
          width={400}
          height={400}
        />

        <div className='flex flex-col gap-2 items-center'>
          <div className='text-lg font-bold'>
            Time: {formatTime(solve.time)}
          </div>
          <div className='text-sm text-muted-foreground'>
            <p><strong>Scramble:</strong> {solve.scramble}</p>
            {solve.solution && (
              <p><strong>Solution:</strong> {solve.solution}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

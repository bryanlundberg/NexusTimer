import { Dialog, DialogContent, DialogTitle, } from '@/components/ui/dialog'
import { useAlgorithmTrainer } from '@/store/AlgorithmTrainer';
import AlgorithmRender from '@/components/twisty/AlgorithmRender';
import * as React from 'react';
import { TwistyPlayer } from 'cubing/twisty';

export default function AlgorithmModal() {
  const isOpen = useAlgorithmTrainer(state => state.isOpen);
  const setIsOpen = useAlgorithmTrainer(state => state.setIsOpen);
  const algorithm = useAlgorithmTrainer(state => state.algorithm);

  if (!algorithm || !algorithm.alg || !algorithm.cube) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={'flex flex-col justify-center items-center gap-4'}>
        <DialogTitle>{algorithm?.name}</DialogTitle>
        <AlgorithmRender
          config={{
            alg: algorithm?.alg || '',
            experimentalDragInput: 'none',
            tempoScale: 1,
            experimentalSetupAnchor: 'end',
            puzzle: algorithm?.cube || '3x3',
            background: 'none',
          } as unknown as TwistyPlayer}
          width={400}
          height={400}
        />

        <div className={'text-lg'}>{algorithm?.alg}</div>
      </DialogContent>
    </Dialog>
  );
}

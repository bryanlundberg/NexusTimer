import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { PARITY_555_ALGS } from '@/algs/parity-555';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={PARITY_555_ALGS}
      title={'5X5 PARITY - Algorithms'}
      description={'A comprehensive collection of algorithms to address parity cases on a 5x5 cube, featuring only one edge parity while the remainder is solved similarly to a 3x3 cube.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: '5x5x5',
        visualization: '3D',
        experimentalDragInput: 'none'
      } as unknown as TwistyPlayer}
      fileCollectionName={'parity-555.ts'}
      puzzle={'5x5x5'}
    />
  )
}

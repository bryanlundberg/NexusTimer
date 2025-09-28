import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { PARITY_444_ALGS } from '@/algs/parity-444';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={PARITY_444_ALGS}
      title={'4X4 PARITY - Algorithms'}
      description={'4x4 Parity - These algorithms are used to resolve parity errors that can occur when solving a 4x4 cube, specifically during the last layer stage. Parity errors happen due to the even number of pieces on a 4x4 cube, which can lead to situations that do not occur on a standard 3x3 cube.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: '4x4x4',
        visualization: '3D',
        experimentalDragInput: 'none'
      } as unknown as TwistyPlayer}
      fileCollectionName={'parity-444.ts'}
      puzzle={'4x4x4'}
    />
  )
}

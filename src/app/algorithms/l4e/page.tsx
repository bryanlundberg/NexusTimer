import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { L4E_ALGS } from '@/algs/l4e';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={L4E_ALGS}
      title={'Las 4 Slots - Algorithms'}
      description={'Last 4 slots (Pyraminx) - These algorithms are used to solve the last four edge pieces of a Pyraminx puzzle. The goal is to position and orient these pieces correctly to complete the puzzle.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: 'pyraminx',
        visualization: '3D',
        experimentalDragInput: 'none',
        cameraLongitude: 45,
      } as unknown as TwistyPlayer}
      fileCollectionName={'l4e.ts'}
      puzzle={'pyraminx'}
    />
  )
}

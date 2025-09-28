import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { PBL_ALGS } from '@/algs/pbl';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={PBL_ALGS}
      title={'PBL - Algorithms'}
      description={'PBL (Permute Both Layers) -  These algorithms are used to permute both the top and bottom layers of a 2x2 cube simultaneously, allowing for efficient solving of the puzzle.'}
      virtualization={{
        experimentalStickering: 'auto',
        puzzle: '2x2x2',
        visualization: '3D',
        experimentalDragInput: 'none'
      } as unknown as TwistyPlayer}
      fileCollectionName={'pbl.ts'}
      puzzle={'2x2x2'}
    />
  )
}

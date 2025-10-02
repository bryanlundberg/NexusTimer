import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { EG_1_ALGS } from '@/algs/eg-1';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={EG_1_ALGS}
      title={'EG-1 - Algorithms'}
      description={'EG-1 solves the cube after the first face is completed, and there must be an adjacent swap on the bottom layer. Hold the 2 solved pieces at the back.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: '2x2x2',
        visualization: '3D',
      } as unknown as TwistyPlayer}
      fileCollectionName={'eg-1.ts'}
      puzzle={'2x2x2'}
    />
  )
}

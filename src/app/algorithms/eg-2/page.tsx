import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { EG_2_ALGS } from '@/algs/eg-2';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={EG_2_ALGS}
      title={'EG-2 - Algorithms'}
      description={'EG-2 solves the cube after the first face is completed, and there must be a diagonal swap on the bottom layer.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: '2x2x2',
        visualization: '3D',
      } as unknown as TwistyPlayer}
      fileCollectionName={'eg-2.ts'}
      puzzle={'2x2x2'}
    />
  )
}

import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { OCLL_ALGS } from '@/algs/ocll';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={OCLL_ALGS}
      title={'OCLL - Algorithms'}
      description={'COLL (Orient Corners of the Last Layer) - This step focuses on orienting all the corners of the last layer to prepare for the final steps of solving the puzzle.'}
      virtualization={{
        experimentalStickering: 'OLL',
        puzzle: '2x2x2',
      } as unknown as TwistyPlayer}
      fileCollectionName={'ocll.ts'}
    />
  )
}

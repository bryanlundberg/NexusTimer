import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { COLL_ALGS } from '@/algs/coll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={COLL_ALGS}
      title={'COLL - Algorithms'}
      description={'COLL (Corners and Orientation of Last Layer) algorithms are used to orient and permute the corners of your last layer at the same time, presuming that all of your last layer edges are already oriented.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
    />
  )
}

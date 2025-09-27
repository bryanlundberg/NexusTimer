import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { PLL_ALGS } from '@/algs/pll';
import { COLL_ALGS } from '@/algs/coll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={COLL_ALGS}
      title={'COLL - Corners and Orientation of Last Layer'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}/>
  )
}

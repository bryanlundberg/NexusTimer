import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { PLL_ALGS } from '@/algs/pll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={PLL_ALGS}
      title={'PLL - Permutation of the Last Layer'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
    />
  )
}

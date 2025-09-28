import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { PLL_ALGS } from '@/algs/pll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={PLL_ALGS}
      title={'PLL - Algorithms'}
      description={'The PLL (Permutation of Last Layer) algorithms for solving the Rubik\'s cube with the CFOP method. These algorithms are used for the final step of the CFOP method, to permute the edges and corners of the last layer, once all pieces are oriented.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'pll.ts'}
    />
  )
}

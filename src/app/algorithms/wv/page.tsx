import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { WV_ALGS } from '@/algs/vw';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={WV_ALGS}
      title={'WV - Algorithms'}
      description={'WV (Winter Variation) algorithms are used to orient the corners of your last layer whilst you insert your final F2L pair, in the case where the pair is connected and where all of the last layer edges are already oriented.'}
      virtualization={{
        experimentalStickering: 'full',
        visualization: '3D',
        experimentalDragInput: 'none',
      } as unknown as TwistyPlayer}
      fileCollectionName={'wv.ts'}
      puzzle={'3x3x3'}
    />
  );
}

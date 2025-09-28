import * as React from 'react';
import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { OLL_ALGS } from '@/algs/oll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={OLL_ALGS}
      title={'OLL - Algorithms'}
      description={'The OLL (Orientation of Last Layer) algorithms for solving the Rubik\'s cube with the CFOP method. These algorithms are used to orient all of the pieces on the last layer, once the F2L is complete.'}
      virtualization={{
        experimentalStickering: 'OLL',
      } as unknown as TwistyPlayer}
    />
  );
}

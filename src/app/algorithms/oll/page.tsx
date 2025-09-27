import * as React from 'react';
import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { OLL_ALGS } from '@/algs/oll';
import { TwistyPlayer } from 'cubing/twisty';

export default function Page() {
  return <AlgorithmsPage algorithms={OLL_ALGS} title={'OLL - Orientation of the Last Layer'} virtualization={{
    experimentalStickering: 'OLL',
  } as unknown as TwistyPlayer}/>;
}

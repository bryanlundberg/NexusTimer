import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_PI_ALGS } from '@/algs/zbll-pi';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_PI_ALGS}
      title={'ZBLL PI - Algorithms'}
      description={'ZBLL PI (ZBLL-PI) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-pi.ts'}
      puzzle={'3x3x3'}
    />
  );
}

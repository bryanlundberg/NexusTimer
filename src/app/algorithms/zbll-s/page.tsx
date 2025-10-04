import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_S_ALGS } from '@/algs/zbll-s';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_S_ALGS}
      title={'ZBLL S - Algorithms'}
      description={'ZBLL S (ZBLL-S) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-s.ts'}
      puzzle={'3x3x3'}
    />
  );
}

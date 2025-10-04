import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_T_ALGS } from '@/algs/zbll-t';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_T_ALGS}
      title={'ZBLL T - Algorithms'}
      description={'ZBLL T (ZBLL-T) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-t.ts'}
      puzzle={'3x3x3'}
    />
  );
}

import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_L_ALGS } from '@/algs/zbll-l';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_L_ALGS}
      title={'ZBLL L - Algorithms'}
      description={'ZBLL L (ZBLL-L) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-l.ts'}
      puzzle={'3x3x3'}
    />
  );
}

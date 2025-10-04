import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_U_ALGS } from '@/algs/zbll-u';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_U_ALGS}
      title={'ZBLL U - Algorithms'}
      description={'ZBLL U (ZBLL-U) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-u.ts'}
      puzzle={'3x3x3'}
    />
  );
}

import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_H_ALGS } from '@/algs/zbll-h';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_H_ALGS}
      title={'ZBLL H - Algorithms'}
      description={'ZBLL H (ZBLL-H) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. Skip the PLL step when you recognize one of these patterns.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-h.ts'}
      puzzle={'3x3x3'}
    />
  );
}

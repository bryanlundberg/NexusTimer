import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { ZBLL_AS_ALGS } from '@/algs/zbll-as';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={ZBLL_AS_ALGS}
      title={'ZBLL Antisune - Algorithms'}
      description={'ZBLL Antisune (ZBLL-AS) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in an antisune configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.'}
      virtualization={{
        experimentalStickering: 'PLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'zbll-as.ts'}
      puzzle={'3x3x3'}
    />
  );
}

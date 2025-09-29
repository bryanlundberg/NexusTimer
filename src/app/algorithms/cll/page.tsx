import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { CLL_ALGS } from '@/algs/cll';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={CLL_ALGS}
      title={'CLL - Algorithms'}
      description={'CLL is a subset of OLL for 2x2x2 cubes that solves the last layer in one algorithm after orienting the first layer.'}
      virtualization={{
        experimentalStickering: 'full',
        puzzle: '2x2x2',
      } as unknown as TwistyPlayer}
      fileCollectionName={'cll.ts'}
      puzzle={'2x2x2'}
    />
  )
}

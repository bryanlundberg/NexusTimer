import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { SARAH_ALGS } from '@/algs/sarah';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={SARAH_ALGS}
      title={'Sarah - Algorithms'}
      description={'Sarah (advanced skewb) algorithms '}
      virtualization={{
        experimentalStickering: 'full',
        visualization: '3D',
        experimentalDragInput: 'none',
        puzzle: 'skewb',
      } as unknown as TwistyPlayer}
      fileCollectionName={'sarah.ts'}
      puzzle={'skewb'}
    />
  );
}

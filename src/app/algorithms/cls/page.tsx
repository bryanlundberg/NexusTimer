import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { BLE_ALGS } from '@/algs/ble';
import { VLS_ALGS } from '@/algs/vls';
import { CLS_ALGS } from '@/algs/cls';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={CLS_ALGS}
      title={'CLS - Algorithms'}
      description={'CLS (Corner Last Slot) algorithms solve the last F2L corner and orient your last layer at the same time. They are used when the edge of your final F2L pair is already solved, and the last layer edges are oriented. This selection of algorithms serves as an introduction to the full CLS algorithm set, and aims to highlight the most useful cases to know.'}
      virtualization={{
        experimentalStickering: 'OLL',
        visualization: '3D',
        experimentalDragInput: 'none',
        hintFacelets: 'none'
      } as unknown as TwistyPlayer}
      fileCollectionName={'cls.ts'}
    />
  );
}

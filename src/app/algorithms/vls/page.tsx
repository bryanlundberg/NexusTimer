import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { BLE_ALGS } from '@/algs/ble';
import { VLS_ALGS } from '@/algs/vls';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={VLS_ALGS}
      title={'VLS - Algorithms'}
      description={'VLS (Valk Last Slot) algorithms solve the final F2L slot and OLL at the same time, in the cases where you have a connected F2L pair. This selection of algorithms serves as an introduction to the full VLS algorithm set, and aims to highlight the most useful cases to know.'}
      virtualization={{
        experimentalStickering: 'OLL',
        visualization: '3D',
        experimentalDragInput: 'none',
        hintFacelets: 'none'
      } as unknown as TwistyPlayer}
      fileCollectionName={'vls.ts'}
    />
  );
}

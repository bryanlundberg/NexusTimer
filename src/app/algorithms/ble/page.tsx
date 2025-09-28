import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { TwistyPlayer } from 'cubing/twisty';
import { BLE_ALGS } from '@/algs/ble';

export default function Page() {
  return (
    <AlgorithmsPage
      algorithms={BLE_ALGS}
      title={'BLE - Algorithms'}
      description={'BLE (Brooks\' Last Edge) algorithms are used to insert an edge into your your last F2L slot and orient the corners of the last layer, in cases where all the last layer edges are already oriented.'}
      virtualization={{
        experimentalStickering: 'OLL',
      } as unknown as TwistyPlayer}
      fileCollectionName={'ble.ts'}
    />
  );
}

'use client';
import ChartResults from '@/components/clash/chart-results/chart-results';
import { Button } from '@/components/ui/button';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useParams, useRouter } from 'next/navigation';
import { FirestoreCollections } from '@/constants/FirestoreCollections';

// IDEAS, INCLUDE PERCENTAGE CLEAN SOLVES - 0 100%
// ADD EACH INDIVIDUAL SOLVE
// RANKS ADD SOME COLOR
// HIGHTLIGHT CURRENT USER IN TABLE

export default function MatchFinished() {
  const { roomId } = useParams();
  const { useDocumentOnce } = useFirestoreCache();
  const { data: room } = useDocumentOnce(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`);
  const router = useRouter();

  return (
    <div className={'max-w-7xl mx-auto mt-5'}>
      <h1 className={'text-3xl font-bold mb-4 text-center'}>RESULTS</h1>
      <ChartResults room={room}/>

      <div className={'flex justify-center mt-6'}>
        <Button
          onClick={() => {
            router.push('/clash');
          }}
        >Back to lobby</Button>
      </div>
    </div>
  )
}

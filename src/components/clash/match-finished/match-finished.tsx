"use client";
import ChartResults from '@/components/clash/chart-results/chart-results';
import { Button } from '@/components/ui/button';
import { useRoomUtils } from '@/hooks/useRoomUtils';
import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';

// IDEAS, INCLUDE PERCENTAGE CLEAN SOLVES - 0 100%
// ADD EACH INDIVIDUAL SOLVE
// RANKS ADD SOME COLOR
// HIGHTLIGHT CURRENT USER IN TABLE

export default function MatchFinished() {
  const { handleLeaveClash } = useRoomUtils();
  const { data: session } = useSession();
  const room = useClashManager((state) => state.room);

  return (
    <div className={'max-w-7xl mx-auto mt-5'}>
      <h1 className={'text-3xl font-bold mb-4 text-center'}>RESULTS</h1>
      <ChartResults/>

      <div className={"flex justify-center mt-6"}>
        <Button onClick={() => handleLeaveClash(room!, session!)}>Back to lobby</Button>
      </div>
    </div>
  )
}

'use client'
import FadeIn from '@/components/fade-in/fade-in';
import { useParams } from 'next/navigation';
import MatchStarted from '@/components/clash/match-started/match-started';

export default function Page() {
  const { roomId } = useParams()
  console.log('Room ID:', roomId);

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      {/*<AwaitingMatch/>*/}
      <MatchStarted/>
    </FadeIn>
  );
}

'use client'
import FadeIn from '@/components/fade-in/fade-in';
import { useParams, useRouter } from 'next/navigation';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useEffect } from 'react';
import { Room } from '@/interfaces/Room';
import { RoomStatus } from '@/enums/RoomStatus';
import AwaitingMatch from '@/components/clash/awaiting-match/awaiting-match';
import MatchStarted from '@/components/clash/match-started/match-started';
import MatchFinished from '@/components/clash/match-finished/match-finished';
import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';
import _ from 'lodash';

export default function Page() {
  const { roomId } = useParams()
  const { useDocument } = useFirestoreCache();
  const { data: session } = useSession();
  const router = useRouter();
  const { data: loadedRoom, loading } = useDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`)
  const room = useClashManager((state => state.room));
  const setRoom = useClashManager((state => state.setRoom));

  useEffect(() => {
    if (!loading && !loadedRoom) {
      router.push('/clash');
    }
  }, [loading, loadedRoom, router]);

  useEffect(() => {
    if (loading) return;
    if (!loadedRoom) return;
    if (room && _.isEqual(room, loadedRoom)) return;
    setRoom(loadedRoom as Room);
  }, [loading, loadedRoom, setRoom, room]);

  if (loading) {
    return null;
  }

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      {room?.status === RoomStatus.IDLE && (<AwaitingMatch/>)}
      {room?.status === RoomStatus.IN_PROGRESS && (<MatchStarted/>)}
      {room?.status === RoomStatus.FINISHED && (<MatchFinished/>)}
    </FadeIn>
  );
}

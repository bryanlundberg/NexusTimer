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
import { useClashManager } from '@/store/ClashManager';
import _ from 'lodash';

export default function Page() {
  const { roomId } = useParams()
  const { useDocument, useCollection } = useFirestoreCache();
  const router = useRouter();
  const { data: loadedRoom, loading: loadingRoom } = useDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`)
  const {
    data: loadedMessages,
    loading: loadingMessages
  } = useCollection(`${FirestoreCollections.CLASH_ROOMS}/${roomId}/messages`, {
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: 10
  });
  const setRoom = useClashManager((state => state.setRoom));
  const setMessages = useClashManager((state => state.setMessages));
  const messages = useClashManager((state => state.messages));
  const room = useClashManager((state => state.room));

  useEffect(() => {
    if (!loadingRoom && !loadedRoom) {
      router.push('/clash');
    }
  }, [loadingRoom, loadedRoom, router]);

  useEffect(() => {
    if (loadingRoom || !loadedRoom || _.isEqual(room, loadedRoom)) return;
    setRoom(loadedRoom as Room);
  }, [loadingRoom, loadedRoom, setRoom, room]);

  useEffect(() => {
    if (loadingMessages || !loadedMessages || _.isEqual(messages, loadedMessages)) return;
    setMessages(loadedMessages);
  }, [loadedMessages, loadingMessages, messages, setMessages]);


  if (loadingRoom) {
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

'use client'
import FadeIn from '@/components/fade-in/fade-in';
import { useParams, useRouter } from 'next/navigation';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useEffect } from 'react';
import { Room } from '@/interfaces/Room';
import { RoomStatus } from '@/enums/RoomStatus';
import { PlayerRole } from '@/enums/PlayerRole';
import { PlayerStatus } from '@/enums/PlayerStatus';
import { RoomType } from '@/enums/RoomType';
import AwaitingMatch from '@/components/clash/awaiting-match/awaiting-match';
import MatchStarted from '@/components/clash/match-started/match-started';
import MatchFinished from '@/components/clash/match-finished/match-finished';
import { useClashManager } from '@/store/ClashManager';
import RoomAuthGate from '@/components/clash/room-auth/room-auth-gate';
import { useClashAuth } from '@/store/ClashAuth';
import { useSession } from 'next-auth/react';
import usePeerRoom from '@/hooks/usePeerRoom';
import { useClashLogsManager } from '@/hooks/useClashLogsManager';
import _ from 'lodash';

export default function Page() {
  const { roomId } = useParams()
  const { connectToPeer, broadcast, listConnectedPeers, peerRef } = usePeerRoom();
  const { useDocument, updateDocument } = useFirestoreCache();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: roomData, loading: loadingRoom } = useDocument<Room>(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`);
  const setRoom = useClashManager((state => state.setRoom));
  const room = useClashManager((state => state.room));
  const authPassword = useClashAuth((s) => s.authorizedByRoom[(roomId as string)]);
  const isPrivate = room?.type === RoomType.PRIVATE;
  const authorized = !isPrivate || (room?.password && authPassword === room.password);
  useClashLogsManager();

  useEffect(() => {
    if (!roomData && !loadingRoom) {
      router.push('/clash');
    }
  }, [roomData, loadingRoom, router]);

  useEffect(() => {
    if (roomData?.id && !loadingRoom && !_.isEqual(room, roomData)) {
      console.log(roomData)
      setRoom(roomData);
    }
  }, [roomData, loadingRoom, setRoom]);

  // Ensure we first connect to the leader; leader will add us to presence upon JOIN
  useEffect(() => {
    if (!peerRef?.open || !room?.authority?.leaderId || !session?.user?.id) return;
    const leaderId = room.authority.leaderId;
    if (leaderId && leaderId !== session.user.id) {
      connectToPeer(leaderId);
    }
  }, [peerRef?.open, room?.authority?.leaderId, session?.user?.id]);

  // Auto-add leader to presence when leader enters the room and is not already present
  useEffect(() => {
    if (!room || !session?.user?.id) return;
    if (room.status !== RoomStatus.IDLE) return;
    const leaderId = room.authority?.leaderId;
    if (!leaderId) return;
    if (leaderId !== session.user.id) return;

    const presence = room.presence || {};
    const alreadyPresent = Object.prototype.hasOwnProperty.call(presence, leaderId);
    if (alreadyPresent) return;

    const now = Date.now();
    updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, {
      [`presence.${leaderId}`]: {
        id: leaderId,
        joinedAt: now,
        name: session.user.name || 'Unknown',
        image: session.user.image || null,
        role: PlayerRole.PLAYER,
        status: PlayerStatus.PREPARING,
        solves: [],
      }
    });
  }, [room, session?.user?.id]);

  if (loadingRoom) {
    return null;
  }

  if (room && isPrivate && !authorized && room.createdBy !== session?.user?.id) {
    return (
      <RoomAuthGate roomId={roomId as string} room={room} onCancel={() => router.push('/clash')}/>
    );
  }

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      <button onClick={() => console.log(listConnectedPeers())}>Conections</button>
      {room?.status === RoomStatus.IDLE && (<AwaitingMatch/>)}
      {room?.status === RoomStatus.IN_PROGRESS && (<MatchStarted broadcast={broadcast}/>)}
      {room?.status === RoomStatus.FINALIZED && (<MatchFinished/>)}
    </FadeIn>
  );
}

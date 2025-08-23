'use client'
import FadeIn from '@/components/fade-in/fade-in';
import { useParams, useRouter } from 'next/navigation';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useEffect, useState } from 'react';
import { Room } from '@/interfaces/Room';
import { RoomStatus } from '@/enums/RoomStatus';
import { RoomType } from '@/enums/RoomType';
import AwaitingMatch from '@/components/clash/awaiting-match/awaiting-match';
import MatchStarted from '@/components/clash/match-started/match-started';
import MatchFinished from '@/components/clash/match-finished/match-finished';
import { useClashManager } from '@/store/ClashManager';
import _ from 'lodash';
import RoomAuthGate from '@/components/clash/room-auth/room-auth-gate';
import { useClashAuth } from '@/store/ClashAuth';
import { useSession } from 'next-auth/react';
import usePeerRoom from '@/hooks/usePeerRoom';
import { useClashLogsManager } from '@/hooks/useClashLogsManager';
import { PlayerRole } from '@/enums/PlayerRole';

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
  const logs = useClashManager((state) => state.logs);
  const [signedInGame, setSignedInGame] = useState(false);
  useClashLogsManager();

  useEffect(() => {
    if (!roomData && !loadingRoom) {
      router.push('/clash');
    }
  }, [roomData, loadingRoom, router]);

  useEffect(() => {
    if (!roomData || loadingRoom || _.isEqual(room, roomData)) return;
    setRoom(roomData);
  }, [roomData, loadingRoom, setRoom, room]);

  useEffect(() => {
    if (!peerRef?.open || !room?.presence) return;
    Object.keys(room.presence || {}).forEach((pid) => {
      connectToPeer(pid);
    });
  }, [room?.presence, peerRef?.open]);

  // Auto-join when accessing via direct link, or redirect if room is full or already in progress
  useEffect(() => {
    const run = async () => {
      if (!room || !session?.user?.id) return;
      if (signedInGame) return;

      const isPrivate = room?.type === RoomType.PRIVATE;
      const authorized = !isPrivate || (room?.password && authPassword === room.password) || room.createdBy === session?.user?.id;

      // Wait for authorization on private rooms (owner bypass allowed)
      if (isPrivate && !authorized) return;

      const me = session.user;
      const presence = room?.presence || {};
      const userRegistered = Object.prototype.hasOwnProperty.call(presence, me.id);
      const playersCount = Object.keys(presence).length;
      const MAX_PLAYERS = 8; // inferred from UI slots

      if (room.status === RoomStatus.IDLE) {
        if (!userRegistered) {
          if (playersCount >= MAX_PLAYERS) {
            // Room full: redirect out
            router.push('/clash');
            return;
          }
          // Join the room
          const newData: any = {
            [`presence.${me.id}`]: {
              joinedAt: Date.now(),
              name: me.name || 'Unknown',
              image: me.image || null,
              id: me.id,
              role: PlayerRole.PLAYER,
            }
          };
          try {
            await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, newData);
            setSignedInGame(true);
          } catch (e) {
            // On failure to join, redirect back
            router.push('/clash');
          }
        }
      } else {
        // IN_PROGRESS or FINISHED: if not already part of the room, redirect out
        if (!userRegistered) {
          router.push('/clash');
        }
      }
    };

    void run();
  }, [authPassword, room, router, session?.user, updateDocument]);

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

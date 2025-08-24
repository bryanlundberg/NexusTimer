'use client'
import FadeIn from '@/components/fade-in/fade-in';
import { useParams, useRouter } from 'next/navigation';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useEffect, useMemo } from 'react';
import { Room } from '@/interfaces/Room';
import { RoomStatus } from '@/enums/RoomStatus';
import { PlayerRole } from '@/enums/PlayerRole';
import { PlayerStatus } from '@/enums/PlayerStatus';
import { RoomType } from '@/enums/RoomType';
import AwaitingMatch from '@/components/clash/awaiting-match/awaiting-match';
import MatchStarted from '@/components/clash/match-started/match-started';
import { useClashManager } from '@/store/ClashManager';
import RoomAuthGate from '@/components/clash/room-auth/room-auth-gate';
import { useClashAuth } from '@/store/ClashAuth';
import { useSession } from 'next-auth/react';
import usePeerRoom from '@/hooks/usePeerRoom';
import { useClashLogsManager } from '@/hooks/useClashLogsManager';
import _ from 'lodash';
import { useCountdown } from '@/hooks/useCountdown';
import { deleteField } from '@firebase/firestore';
import { useRoomUtils } from '@/hooks/useRoomUtils';

export default function Page() {
  const { roomId } = useParams()
  const { connectToPeer, broadcast, listConnectedPeers, peerRef } = usePeerRoom();
  const { useDocument, updateDocument } = useFirestoreCache();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: roomData, loading: loadingRoom } = useDocument<Room>(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`);
  const setRoom = useClashManager((state => state.setRoom));
  const room = useClashManager((state => state.room));
  // Countdown for open round end time to trigger leader actions exactly at cutoff
  const roundEndTime = useMemo(() => {
    const idx = Math.max(0, (room?.rounds || []).findIndex((r) => r?.status === 'open'));
    return room?.rounds?.[idx]?.plannedEndTime;
  }, [room?.rounds]);
  const { isFinished: roundTimeFinished } = useCountdown(roundEndTime);
  const authPassword = useClashAuth((s) => s.authorizedByRoom[(roomId as string)]);
  const isPrivate = room?.type === RoomType.PRIVATE;
  const authorized = !isPrivate || (room?.password && authPassword === room.password);
  useClashLogsManager();
  const {
    allParticipantsSubmitted,
    closeRound,
    openNextRound,
    cloneRoom,
  } = useRoomUtils();

  useEffect(() => {
    if (roomData) return;
    if (loadingRoom) return;
    router.push('/clash');
  }, [roomData, loadingRoom, router]);

  useEffect(() => {
    if (roomData?.id && !loadingRoom && !_.isEqual(room, roomData)) {
      setRoom(roomData);
    }
  }, [roomData, loadingRoom, setRoom]);

  // Re-elect a leader when leaderId is missing
  useEffect(() => {
    if (!room || !session?.user?.id) return;
    const currentLeader = room.authority?.leaderId;
    if (currentLeader) return;

    const presence = room.presence || {};
    const presenceIds = Object.keys(presence);

    // Prefer current user if present or if presence is empty; otherwise choose deterministically
    let candidateId = session.user.id as string;
    if (presenceIds.length > 0 && !presenceIds.includes(candidateId)) {
      candidateId = presenceIds.sort()[0];
    }

    // Only the candidate performs the update to avoid races
    if (candidateId !== session.user.id) return;

    updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, {
      'authority.leaderId': candidateId,
    });
  }, [room?.authority?.leaderId, room?.presence, room?.id, session?.user?.id]);

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
      }
    });
  }, [room, session?.user?.id]);

  // Leader-only presence reconciliation using active connections
  useEffect(() => {
    if (!room || !session?.user?.id) return;
    const leaderId = room.authority?.leaderId;
    if (!leaderId || leaderId !== session.user.id) return;

    let timer: any = null;
    const tick = () => {
      const presence = room.presence || {};
      const active = new Set<string>([session.user!.id, ...listConnectedPeers()]);
      const toRemove: string[] = Object.keys(presence).filter(uid => !active.has(uid));
      if (toRemove.length === 0) return;

      const updates: Record<string, any> = {};
      toRemove.forEach(uid => {
        updates[`presence.${uid}`] = deleteField();
      });
      updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, updates);
    };

    timer = setInterval(tick, 2000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [room, session?.user?.id, listConnectedPeers]);

  // Leader-only round controller: close/open rounds and finalize match
  useEffect(() => {
    if (!room || !session?.user?.id) return;
    const leaderId = room.authority?.leaderId;
    if (!leaderId || leaderId !== session.user.id) return;
    if (room.status !== RoomStatus.IN_PROGRESS) return;

    const openIndex = (room.rounds || []).findIndex(r => r?.status === 'open');
    if (openIndex === -1) return;

    const presentUserIds = Object.keys(room.presence || {});
    const finalization = room.rounds?.[openIndex]?.plannedEndTime;
    const now = Date.now();

    let shouldClose = false;
    let closedBecauseAllFinishedEarly = false;
    try {
      if (finalization && now >= finalization) {
        shouldClose = true;
      } else if (room.rounds && room.rounds[openIndex]) {
        const everyoneDone = allParticipantsSubmitted(room.rounds[openIndex] as any, presentUserIds);
        if (everyoneDone) {
          shouldClose = true;
          closedBecauseAllFinishedEarly = finalization ? now < finalization : true;
        }
      }
    } catch (e) {
      shouldClose = false;
    }

    if (!shouldClose) return;

    if (closedBecauseAllFinishedEarly) {
      console.log(`[Clash] All present players finished round ${openIndex + 1} before the time limit. Advancing early.`);
    }

    let newRoom = cloneRoom(room);
    newRoom = closeRound(newRoom, openIndex, presentUserIds, room.presence);

    const isLast = openIndex >= (room.totalRounds - 1);
    if (isLast) {
      updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, {
        rounds: newRoom.rounds,
        status: RoomStatus.FINALIZED,
      });
      return;
    }

    const nextIndex = openIndex + 1;
    newRoom = openNextRound(newRoom, nextIndex, room.presence);

    updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, {
      rounds: newRoom.rounds,
    });
  }, [room, session?.user?.id, roundTimeFinished]);

  // Redirect to results page when match is finalized; redirect to lobby if cancelled
  useEffect(() => {
    if (!room?.id) return;
    if (room.status === RoomStatus.FINALIZED) {
      router.push(`/clash/${room.id}/results`);
      return;
    }
    if (room.status === RoomStatus.CANCELLED) {
      router.push('/clash');
      return;
    }
  }, [room?.status, room?.id, router]);

  if (loadingRoom) {
    return null;
  }

  if (room && isPrivate && !authorized && session?.user?.id && room.createdBy !== session.user.id) {
    return (
      <RoomAuthGate roomId={roomId as string} room={room} onCancel={() => router.push('/clash')}/>
    );
  }

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      {room?.status === RoomStatus.IDLE && (<AwaitingMatch/>)}
      {room?.status === RoomStatus.IN_PROGRESS && (<MatchStarted broadcast={broadcast}/>)}
    </FadeIn>
  );
}

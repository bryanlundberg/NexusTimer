import moment from 'moment/moment';
import genScramble from '@/lib/timer/genScramble';
import { Categories } from '@/interfaces/Categories';
import { Penalty, Room, RoundEntry, RoundRecord } from '@/interfaces/Room';
import { toast } from 'sonner';
import { RoomStatus } from '@/enums/RoomStatus';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { Session } from 'next-auth';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useRouter } from 'next/navigation';
import { useClashManager } from '@/store/ClashManager';
import _ from 'lodash';

export const useRoomUtils = () => {
  const { updateDocument } = useFirestoreCache();
  const router = useRouter();
  const reset = useClashManager((state => state.reset));

  const buildInitialRounds = (totalRounds: number, maxRoundTime: number, event: Categories, room: Room) => {
    const now = moment();
    // Each round should end after its own duration; first round ends at now + maxRoundTime
    const times = Array.from({ length: totalRounds || 0 }, (_, i) => now.clone().add((i + 1) * (maxRoundTime || 30), 'seconds').valueOf());

    const presentEntries: Record<string, any> = {};
    Object.values(room?.presence || {}).forEach((p: any) => {
      if (!p?.id) return;
      presentEntries[p.id] = { userId: p.id, name: p.name, image: p.image, participated: false, dns: false, penalty: null };
    });

    const rounds = Array.from({ length: totalRounds || 0 }, (_, i) => {
      const r: any = {
        index: i,
        status: i === 0 ? 'open' : 'closed',
        plannedEndTime: times[i],
        entries: i === 0 ? presentEntries : {},
        scramble: genScramble(room?.event || '3x3')
      };
      if (i === 0) r.startedAt = now.valueOf();
      return r;
    });

    return { rounds };
  }

  const handleCopyRoomLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Clash link copied to clipboard!')
  }

  const handleLeaveClash = async (room: Room, session: Session) => {
    // If the leader is the only person in an IDLE room, mark it as CANCELLED before leaving
    if (room?.authority.leaderId === session?.user?.id && room?.status === RoomStatus.IDLE && Object.keys(room?.presence || {}).length === 1) {
      const newData = {
        status: RoomStatus.CANCELLED,
      }
      await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, newData)
    }

    router.push('/clash');
    reset();
  }

  function calculateFinalMs(rawMs?: number, penalty: Penalty = null): number | undefined {
    if (rawMs === undefined) return undefined
    if (penalty === 'DNF') return Number.POSITIVE_INFINITY
    if (penalty === '+2') return rawMs + 2000
    return rawMs
  }

  function initializeRoundEntriesFromPresence(presence: Room['presence']): Record<string, RoundEntry> {
    const entries: Record<string, RoundEntry> = {}
    Object.values(presence || {}).forEach((p) => {
      if (!p?.id) return
      entries[p.id] = {
        userId: p.id,
        name: p.name,
        image: p.image,
        participated: false,
        dns: false,
        penalty: null,
      }
    })
    return entries
  }

  function applySolve(round: RoundRecord, userId: string, rawMs: number, penalty: Penalty = null): RoundRecord {
    if (round.status !== 'open') return round
    const finalMs = calculateFinalMs(rawMs, penalty)
    const prev = round.entries[userId]
    return {
      ...round,
      entries: {
        ...round.entries,
        [userId]: {
          ...(prev || { userId, participated: false, dns: false, penalty: null }),
          userId: prev?.userId || userId,
          rawMs,
          finalMs,
          penalty,
          participated: true,
          dns: false,
          submittedAt: Date.now(),
          submittedBy: userId,
          source: 'auto',
        },
      },
    }
  }

  function markDnsForAbsents(round: RoundRecord, presentUserIdsAtClose: string[], presence: Room['presence']): RoundRecord {
    const updatedEntries: Record<string, RoundEntry> = { ...round.entries }

    // All known participants at the time of closing
    const knownUserIds = new Set(Object.keys(round.entries))
    presentUserIdsAtClose.forEach((uid) => knownUserIds.add(uid))

    knownUserIds.forEach((uid) => {
      const entry = updatedEntries[uid]
      if (!entry || !entry.participated) {
        const p = presence?.[uid]
        updatedEntries[uid] = {
          userId: uid,
          name: p?.name,
          image: p?.image,
          participated: false,
          dns: true,
          penalty: null,
        }
      }
    })

    return { ...round, entries: updatedEntries }
  }

  function closeRound(room: Room, roundIndex: number, presentUserIdsAtClose: string[], presence: Room['presence']): Room {
    if (!room.rounds || !room.rounds[roundIndex]) return room
    const r = room.rounds[roundIndex]
    if (r.status === 'closed') return room

    let updated = markDnsForAbsents(r, presentUserIdsAtClose, presence)
    updated = {
      ...updated,
      status: 'closed',
      closedAt: Date.now(),
    }

    const rounds = [...room.rounds]
    rounds[roundIndex] = updated
    return { ...room, rounds }
  }

  function openNextRound(room: Room, nextIndex: number, presence: Room['presence']): Room {
    const entries = initializeRoundEntriesFromPresence(presence)
    const now = Date.now();
    const plannedEndTime = now + (Number(room.maxRoundTime) || 30) * 1000;
    const next: RoundRecord = {
      index: nextIndex,
      status: 'open',
      startedAt: now,
      plannedEndTime,
      entries,
      scramble: genScramble(room?.event || '3x3') as any,
    }
    const rounds = [...(room.rounds || [])]
    rounds[nextIndex] = next

    return { ...room, rounds }
  }

  function computeNewLeader(
    presence: Room['presence'],
    currentLeaderId: string | null,
    leavingUserId: string,
    createdBy: string | undefined | null,
  ): { leaderId: string | null; termIncrement: 1 | 0 } {
    if (currentLeaderId !== leavingUserId) {
      // leader not leaving; no change
      return { leaderId: currentLeaderId, termIncrement: 0 }
    }

    // Pick earliest joined remaining player
    const candidates = Object.values(presence || {})
      .filter((p) => p.id !== leavingUserId)
      .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0))

    const newLeader = candidates[0]?.id || null
    if (newLeader) return { leaderId: newLeader, termIncrement: 1 }

    // No players left; keep null leader (creator may reclaim later)
    return { leaderId: null, termIncrement: 1 }
  }

  function allParticipantsSubmitted(round: RoundRecord, presentUserIds: string[]): boolean {
    // If no one is present, the round is NOT considered complete
    if (!presentUserIds || presentUserIds.length === 0) return false
    // Consider only present users for completion
    for (const uid of presentUserIds) {
      const e = round.entries[uid]
      if (!e || !e.participated) return false
    }
    return true
  }

  function cloneRoom(room: Room): Room {
    // shallow-deep clone for our objects
    return _.cloneDeep(room)
  }

  const buildStartMatchUpdate = (room: Room) => {
    const totalRounds = room?.totalRounds || 0;
    const maxRoundTime = Number(room?.maxRoundTime) || 30;
    const { rounds } = buildInitialRounds(totalRounds, maxRoundTime, room.event, room);
    return {
      status: RoomStatus.IN_PROGRESS,
      rounds: rounds as any,
      matchFinalizationTime: moment().add(Number(totalRounds) * Number(room.maxRoundTime), 'seconds').valueOf(),
    } as const;
  }

  const startMatchNow = async (roomId: string | number, room: Room) => {
    const update = buildStartMatchUpdate(room);
    await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomId}` as string, update);
  }

  return {
    buildInitialRounds,
    handleCopyRoomLink,
    handleLeaveClash,
    calculateFinalMs,
    initializeRoundEntriesFromPresence,
    applySolve,
    markDnsForAbsents,
    closeRound,
    openNextRound,
    computeNewLeader,
    allParticipantsSubmitted,
    cloneRoom,
    buildStartMatchUpdate,
    startMatchNow
  };
}

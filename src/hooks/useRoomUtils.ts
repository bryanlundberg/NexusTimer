import moment from 'moment/moment';
import genScramble from '@/lib/timer/genScramble';
import { Categories } from '@/interfaces/Categories';
import { Room } from '@/interfaces/Room';
import { toast } from 'sonner';
import { RoomStatus } from '@/enums/RoomStatus';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { Session } from 'next-auth';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useRouter } from 'next/navigation';
import { useClashManager } from '@/store/ClashManager';

export const useRoomUtils = () => {
  const { updateDocument } = useFirestoreCache();
  const router = useRouter();
  const reset = useClashManager((state => state.reset));

  const buildInitialRounds = (totalRounds: number, maxRoundTime: number, event: Categories, room: Room) => {
    const now = moment();
    const times = Array.from({ length: totalRounds || 0 }, (_, i) => now.clone().add(i * (maxRoundTime || 30), 'seconds').valueOf());

    const presentEntries: Record<string, any> = {};
    Object.values(room?.presence || {}).forEach((p: any) => {
      if (!p?.id) return;
      presentEntries[p.id] = { participated: false, dns: false, penalty: null };
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

    return { rounds, times };
  }

  const handleCopyRoomLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Clash link copied to clipboard!')
  }

  const handleLeaveClash = async (room: Room, session: Session) => {
    if (room?.authority.leaderId === session?.user?.id && room?.status === RoomStatus.IDLE && Object.keys(room?.presence || {}).length === 1) {
      const newData = {
        status: RoomStatus.FINALIZED,
      }
      await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, newData)
    }

    router.push('/clash');
    reset();
  }

  return {
    buildInitialRounds,
    handleCopyRoomLink,
    handleLeaveClash
  };
}

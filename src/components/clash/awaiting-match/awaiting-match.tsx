import { Button } from '@/components/ui/button';
import { LoaderCircle, Share2Icon } from 'lucide-react';
import PlayerMiniCard from '../player-mini-card/player-mini-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { useCountdown } from '@/hooks/useCountdown';
import { RoomStatus } from '@/enums/RoomStatus';
import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';
import { useRoomUtils } from '@/hooks/useRoomUtils';

export default function AwaitingMatch() {
  const { roomId } = useParams()
  const { updateDocument } = useFirestoreCache();
  const { data: session } = useSession();
  const room = useClashManager((state => state.room));
  const { buildInitialRounds, handleCopyRoomLink, handleLeaveClash } = useRoomUtils()

  const prepEndTime = useMemo(() => {
    if (!room) return undefined;
    return room.preparationFinalizationTime;
  }, [room]);

  const { mmss, remainingMs } = useCountdown(prepEndTime);

  const users = useMemo(() => {
    if (!room?.presence || !Object.keys(room?.presence).length) return [];
    return Object.values(room?.presence).filter(Boolean).map(user => user as any);
  }, [room]);

  const shouldShowStartButton = useMemo(() => {
    return (session?.user?.id === room?.authority?.leaderId) && users.length >= 2
  }, [session?.user?.id, room?.authority.leaderId, users.length]);

  // Auto-start match when countdown reaches 0 (leader-only, requires at least 2 players)
  useEffect(() => {
    if (!room || room.status !== RoomStatus.IDLE) return;
    if (remainingMs === undefined || remainingMs > 0) return;
    const isLeader = session?.user?.id === room?.authority?.leaderId;
    const enoughPlayers = users.length >= 2;
    if (!isLeader || !enoughPlayers) return;
    const {
      rounds,
      times
    } = buildInitialRounds(room?.totalRounds || 0, Number(room?.maxRoundTime) || 30, room.event, room);
    updateDocument(
      `${FirestoreCollections.CLASH_ROOMS}/${roomId}`,
      {
        status: RoomStatus.IN_PROGRESS,
        rounds: rounds as any,
        roundsFinalizationTimes: times,
        matchFinalizationTime: moment().add(room?.totalRounds || 0, 'minutes').valueOf(),
      }
    )
  }, [remainingMs, room?.status, room?.authority?.leaderId, room?.totalRounds, room?.maxRoundTime, session?.user?.id, users.length, roomId]);

  const handleStartMatch = async () => {
    if (!room) return;
    const {
      rounds,
      times
    } = buildInitialRounds(room?.totalRounds || 0, Number(room?.maxRoundTime) || 30, room.event, room);
    updateDocument(
      `${FirestoreCollections.CLASH_ROOMS}/${roomId}`,
      {
        status: RoomStatus.IN_PROGRESS,
        rounds: rounds as any,
        roundsFinalizationTimes: times,
        matchFinalizationTime: moment().add(room?.totalRounds || 0, 'minutes').valueOf(),
      }
    )
  }

  return (
    <div className={'grid grid-cols-1'}>
      <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center mt-2 [text-shadow:0_0_7px_rgba(255,255,255,0.8)] pt-2">Clash
        Of
        Cubing</h1>
      <div className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-2">
        <LoaderCircle size={16} className={'animate-spin'}/>
        <div>
          <div>Please wait while more people join your game.</div>
          <div>At least 2 players are required to start a clash.</div>
        </div>
      </div>
      <div className={'flex gap-3 mt-4 justify-center items-center'}>
        <Button onClick={() => handleLeaveClash(room!, session!)} variant={'secondary'} className={'w-fit'}>Leave
          clash</Button>
        {shouldShowStartButton && <Button onClick={handleStartMatch}>Start now!</Button>}
      </div>

      <div className={'flex flex-col justify-center items-center mt-5 text-lg font-semibold text-muted-foreground grow'}>
        <h3>Clash starts in {remainingMs !== undefined ? mmss : '--:--'}</h3>
        <div className={'grid grid-cols-4 gap-3 mt-5'}>
          {Array.from({ length: 8 }).map((_, index) => {
            const user = users[index];
            return (
              <PlayerMiniCard
                key={user?.id || index}
                name={user?.name || `Waiting...`}
                avatarUrl={user?.image}
              />
            );
          })}
        </div>
      </div>

      <div className={'px-4'}>
        <Card className="max-w-[500px] w-full mx-auto mt-5 mb-10">
          <CardHeader>
            <CardTitle className={'flex gap-2'}><Share2Icon size={16}/> Share this Clash</CardTitle>
            <CardDescription>
              {room ? (
                <>
                  {room.name || 'Untitled'} · {(room.event || '').toUpperCase()} · {room.totalRounds} rounds
                  · {room.maxRoundTime}s/round · {users.length} player{users.length === 1 ? '' : 's'} · {room.type}
                </>
              ) : (
                'Clash details not available'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              value={window?.location?.href || ''}
              readOnly
              className="cursor-pointer"
            />
            <Button onClick={handleCopyRoomLink} variant="outline" className="shrink-0">Copy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

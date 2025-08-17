import { Button } from '@/components/ui/button';
import { LoaderCircle, Share2Icon } from 'lucide-react';
import PlayerMiniCard from '../player-mini-card/player-mini-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { RoomStatus } from '@/enums/RoomStatus';
import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';
import { deleteField } from '@firebase/firestore';

export default function AwaitingMatch() {
  const router = useRouter();
  const { roomId } = useParams()
  const { updateDocument } = useFirestoreCache();
  const { data: session } = useSession();
  const [remainingMs, setRemainingMs] = useState<number | undefined>(undefined);
  const room = useClashManager((state => state.room));

  const prepEndTime = useMemo(() => {
    if (!room) return undefined;
    return room.preparationFinalizationTime;
  }, [room]);

  useEffect(() => {
    if (!prepEndTime) {
      setRemainingMs(undefined);
      return;
    }
    const update = () => {
      const now = Date.now();
      const ms = Math.max(0, prepEndTime - now);
      setRemainingMs(ms);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [prepEndTime]);

  const shouldShowStartButton = useMemo(() => {
    return true
  }, []);

  const handleLeaveClash = async () => {
    const newData = {
      [`presence.${session?.user?.id}`]: deleteField(),
    }

    await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`, newData)
    router.push('/clash');
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Clash link copied to clipboard!')
  }

  const handleStartClash = async () => {
    await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomId}`, {
      status: RoomStatus.IN_PROGRESS,
      roundsFinalizationTimes: Array.from({ length: room?.totalRounds || 0 }, (_, i) => moment().add(i * (room?.maxRoundTime || 30), 'seconds').valueOf()),
      matchFinalizationTime: moment().add(room?.totalRounds || 0, 'minutes').valueOf(),
    })
    toast.success('Clash started! Good luck!')
  }

  const users = useMemo(() => {
    if (!room || !room?.presence || !Object.keys(room?.presence).length) return [];
    return Object.values(room?.presence).filter(Boolean).map(user => user as any);
  }, [room]);

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
      <Button onClick={handleLeaveClash} variant={'secondary'} className={'w-fit mx-auto mt-4'}>Leave clash</Button>
      {shouldShowStartButton && <Button onClick={handleStartClash}>Start now!</Button>}

      <div className={'flex flex-col justify-center items-center mt-5 text-lg font-semibold text-muted-foreground grow'}>
        <h3>Clash starts in {remainingMs !== undefined ? moment.utc(remainingMs).format('mm:ss') : '--:--'}</h3>
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
            <CardDescription>Clash of Cubing - 3x3</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              value={window?.location?.href || ''}
              readOnly
              className="cursor-pointer"
            />
            <Button onClick={handleCopyLink} variant="outline" className="shrink-0">Copy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

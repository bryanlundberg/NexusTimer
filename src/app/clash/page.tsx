'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation/navigation';
import { Dialog, DialogTrigger, } from '@/components/ui/dialog';
import { AlertCircleIcon, Globe2, Lock } from 'lucide-react';
import FadeIn from '@/components/fade-in/fade-in';
import ButtonNavbar from '@/components/navigation/buttons/button-navbar';
import RealtimePill from '@/components/clash/real-time/realtime-pill';
import { CreateRoomModalContent } from '@/components/clash/create-room-modal/create-room-modal';
import RoomsList from '@/components/clash/rooms-list/rooms-list';
import { RoomType } from '@/enums/RoomType';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { RoomStatus } from '@/enums/RoomStatus';
import { useClashManager } from '@/store/ClashManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function Page() {
  const [createMode, setCreateMode] = useState<RoomType | null>(null);
  const { useCollection } = useFirestoreCache();
  const now = useMemo(() => Date.now(), []);
  const reset = useClashManager(s => s.reset);
  const queryOptions = useMemo(() => ({
    where: [
      { field: 'status', operator: '==', value: RoomStatus.IDLE },
      { field: 'preparationFinalizationTime', operator: '>', value: now },
    ],
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: 50,
  }), [now]);

  const { data: rooms } = useCollection(
    FirestoreCollections.CLASH_ROOMS,
    queryOptions
  );

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <>
      <FadeIn className="flex flex-col grow overflow-auto">
        <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full">
          <Navigation showMenu={false}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className={'flex justify-between'}>
                <ButtonNavbar/>
                <div className={'flex items-center justify-end text-xs text-muted-foreground'}>
                  <RealtimePill/>
                </div>
              </div>
              <div className={'flex justify-end grow items-center gap-2'}>
                <Dialog
                  open={createMode === RoomType.PUBLIC}
                  onOpenChange={(open) => setCreateMode(open ? RoomType.PUBLIC : null)}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setCreateMode(RoomType.PUBLIC)} className="gap-2">
                      <Globe2 className="size-4"/> Create Public
                    </Button>
                  </DialogTrigger>
                  <CreateRoomModalContent mode={RoomType.PUBLIC}/>
                </Dialog>

                <Dialog
                  open={createMode === RoomType.PRIVATE}
                  onOpenChange={(open) => setCreateMode(open ? RoomType.PRIVATE : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setCreateMode(RoomType.PRIVATE)} className="gap-2">
                      <Lock className="size-4"/> Create Private
                    </Button>
                  </DialogTrigger>
                  <CreateRoomModalContent mode={RoomType.PRIVATE}/>
                </Dialog>
              </div>
            </div>
          </Navigation>

          <Alert variant="default" className={"mb-2"}>
            <AlertCircleIcon/>
            <AlertTitle>Important: Clash Cubing Mode is in Beta</AlertTitle>

            <AlertDescription>
              <p>If you encounter any bugs, please help us improve by reporting them. <Link className={"text-primary hover:underline"} href={"https://github.com/bryanlundberg/NexusTimer/issues"} target={"_blank"}>Here</Link> </p>
              <ul className="list-inside list-disc text-sm">
                <li>Refrain from using multiple windows simultaneously.</li>
                <li>Ensure a stable internet connection to avoid disruptions.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <RoomsList rooms={rooms}/>
          </div>
        </div>
      </FadeIn>
    </>
  );
}


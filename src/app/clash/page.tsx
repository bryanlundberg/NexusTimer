'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation/navigation';
import { Dialog, DialogTrigger, } from '@/components/ui/dialog';
import { Globe2, Lock } from 'lucide-react';
import FadeIn from '@/components/fade-in/fade-in';
import ButtonNavbar from '@/components/navigation/buttons/button-navbar';
import RealtimePill from '@/components/clash/real-time/realtime-pill';
import { CreateRoomModalContent } from '@/components/clash/create-room-modal/create-room-modal';
import RoomsList from '@/components/clash/rooms-list/rooms-list';
import { RoomType } from '@/enums/RoomType';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { RoomStatus } from '@/enums/RoomStatus';

export default function Page() {
  const [createMode, setCreateMode] = useState<RoomType | null>(null);
  const { useCollection } = useFirestoreCache();
  const now = useMemo(() => Date.now(), []);
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

          <div className="flex flex-col gap-3">
            <RoomsList rooms={rooms}/>
          </div>
        </div>
      </FadeIn>
    </>
  );
}


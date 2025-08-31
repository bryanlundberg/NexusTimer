import { Card } from '@/components/ui/card';
import { Globe2, Lock, Play, ShieldCheck, TimerReset, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoomStatus from '@/components/clash/room-status/room-status';
import { Room } from '@/interfaces/Room';
import { RoomType } from '@/enums/RoomType';
import { RoomStatus as RoomStatusEnum } from '@/enums/RoomStatus';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { useSession } from 'next-auth/react';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useRouter } from 'next/navigation';
import moment from 'moment';

interface RoomsListProps {
  rooms: Room[]
}

export default function RoomsList({ rooms }: RoomsListProps) {
  const { data: session } = useSession()
  const { updateDocument } = useFirestoreCache()
  const router = useRouter();
  const handleJoinRoom = async (room: Room) => {
    const userRegistered = Object.keys(room?.presence || {}).some(key => key === session?.user?.id);
    if (room && room.status === RoomStatusEnum.IDLE && session?.user?.id) {
      if (!userRegistered) {
        const newData = {
          [`presence.${session.user.id}`]: {
            joinedAt: Date.now(),
            name: session.user.name || 'Unknown',
            image: session.user.image || null,
            id: session.user.id,
            role: 'player',
          }
        }

        await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${room.id}`, newData)
      }

      router.push(`/clash/${room.id}`);
    }
  }

  if (Array.isArray(rooms) && rooms.length === 0) {
    return (
      <Card className="relative overflow-hidden border-dashed bg-background">
        <div className="pointer-events-none absolute -inset-1 opacity-50 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative py-12 px-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="rounded-full bg-primary/10 text-primary p-3">
            <Sparkles className="size-8" />
          </div>
          <h3 className="text-lg font-semibold">No rooms available</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Be the first to start a clash. Use the “Create Public” or “Create Private” buttons above to open a new room.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      {rooms?.map((room) => (
        <Card key={room.id} className="relative py-3 gap-2">
          <div className="flex items-center justify-between flex-wrap gap-3 px-6">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {room.type === RoomType.PRIVATE ? (
                <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs shrink-0">
                    <Lock className="size-3"/> Private
                  </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs shrink-0">
                    <Globe2 className="size-3"/> Public
                  </span>
              )}
              <span className="font-semibold whitespace-nowrap">{room.name}</span>
              <RoomStatus status={room.status}/>
            </div>

            <div className="flex items-center gap-2 justify-end w-full">
              <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground justify-end">
                <span className="inline-flex items-center gap-1"><Users className="size-4"/> {Object.keys(room?.presence || {})?.length || 0}</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="size-4"/> {room.event}</span>
                <span className="inline-flex items-center gap-1"><TimerReset className="size-4"/> Rounds Time: {moment.utc(Number(room.maxRoundTime) * 1000).format('mm:ss')}</span>
                <span className="inline-flex items-center gap-1">
                    Rounds {room.totalRounds}
                  </span>
              </div>
              {room.status === RoomStatusEnum.IDLE && (
                <Button onClick={() => handleJoinRoom(room)} size="sm" className="inline-flex items-center gap-1">
                  <Play className="size-4"/> Join
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}

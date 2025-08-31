import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Room } from '@/interfaces/Room';
import { RoomStatus as RoomStatusEnum } from '@/enums/RoomStatus';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAlert from '@/hooks/useAlert';
import RoomListItem from '@/components/clash/rooms-list/room-list-item';

interface RoomsListProps {
  rooms: Room[]
}

export default function RoomsList({ rooms }: RoomsListProps) {
  const { data: session } = useSession()
  const router = useRouter();
  const alert = useAlert();

  const handleJoinRoom = async (room: Room) => {
    if (!session?.user?.id) {
      return await alert({
        title: 'You must be logged in to join a room',
        subtitle: 'Please log in and try again.',
        hideCancel: true
      });
    }

    if (room && room.status === RoomStatusEnum.IDLE) {
      router.push(`/clash/${room.id}`);
    }
  }

  if (Array.isArray(rooms) && rooms.length === 0) {
    return (
      <Card className="relative overflow-hidden border-dashed bg-background">
        <div className="pointer-events-none absolute -inset-1 opacity-50 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"/>
        <div className="relative py-12 px-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="rounded-full bg-primary/10 text-primary p-3">
            <Sparkles className="size-8"/>
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
        <RoomListItem key={room.id} room={room} onJoin={handleJoinRoom} />
      ))}
    </>
  )
}

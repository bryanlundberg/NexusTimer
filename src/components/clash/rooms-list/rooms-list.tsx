import { Card } from '@/components/ui/card';
import { Globe2, Lock, Play, ShieldCheck, TimerReset, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoomStatus from '@/components/clash/room-status/room-status';
import { Room } from '@/interfaces/Room';
import { RoomType } from '@/enums/RoomType';

interface RoomsListProps {
  rooms: Room[]
}

export default function RoomsList({ rooms }: RoomsListProps) {
  return (
    <>
      {rooms?.map((room) => (
        <Card key={room.id} className="relative py-3 gap-2">
          <div className="flex items-center justify-between flex-wrap gap-3 px-6">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {room.type === RoomType.PRIVATE ? (
                <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs shrink-0">
                    <Lock className="size-3"/> Privada
                  </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs shrink-0">
                    <Globe2 className="size-3"/> Pública
                  </span>
              )}
              <span className="font-semibold whitespace-nowrap">{room.name}</span>
              <RoomStatus status={room.status}/>
            </div>

            <div className="flex items-center gap-2 justify-end w-full">
              <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground justify-end">
                <span className="inline-flex items-center gap-1"><Users className="size-4"/> {room.participants}</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="size-4"/> {room.event}</span>
                <span className="inline-flex items-center gap-1"><TimerReset className="size-4"/> Máx: {room.maxPreparationTime}</span>
                <span className="inline-flex items-center gap-1">
                    Ronda 2/5
                  </span>
              </div>
              {room.status === 'in-progress' ? (
                <Button size="sm" className="gap-2" aria-label="Continuar sala">
                  <Play className="size-4"/> Continuar
                </Button>
              ) : (
                <Button size="sm" variant="secondary" className="gap-2" aria-label="Acceder a sala">
                  <Play className="size-4"/> Acceder
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}

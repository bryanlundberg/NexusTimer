import { Clock } from 'lucide-react';
import { RoomStatus as RoomStatusEnum } from '@/enums/RoomStatus';

export default function RoomStatus({ status }: { status: RoomStatusEnum }) {
  return (
    <>
      {status === RoomStatusEnum.IN_PROGRESS && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 px-2 py-1 whitespace-nowrap text-[10px]">
          <Clock className="size-3"/> In Progress
        </span>
      )}
      {status === RoomStatusEnum.IDLE && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200 px-2 py-1 whitespace-nowrap text-[10px]">
           <Clock className="size-3"/> Awaiting Players
        </span>
      )}
    </>
  )
}

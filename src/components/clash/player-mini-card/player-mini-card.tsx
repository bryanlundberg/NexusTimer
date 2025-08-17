import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PlayerStatus } from '@/store/clash-players';

export interface PlayerMiniCardProps {
  name?: string;
  avatarUrl?: string;
  status?: PlayerStatus;
}

export default function PlayerMiniCard({ name, avatarUrl, status }: PlayerMiniCardProps) {
  const truncated = name ? (name.length > 10 ? `${name.slice(0, 10)}…` : name) : '';
  const statusColor = status === 'solving' ? 'bg-green-500' : status === 'inspection' ? 'bg-yellow-500' : status === 'waiting' ? 'bg-muted-foreground' : '';

  return (
    <div className={'flex flex-col items-center justify-center bg-card rounded-lg p-4 size-18 md:size-20 lg:size-32'}>
      <div className={'relative'}>
        {avatarUrl && (
          <Avatar className={'w-full h-full'}>
            <AvatarImage src={avatarUrl} className={'object-cover'}/>
            <AvatarFallback>{(name?.[0] || '?').toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        {status && (
          <span
            title={status}
            className={`absolute -bottom-1 -right-1 inline-flex h-5 w-5 rounded-full border-2 border-background ${statusColor}`}
          />
        )}
      </div>
      <p className={'text-center text-sm mt-1'}>{truncated}</p>
    </div>
  );
}

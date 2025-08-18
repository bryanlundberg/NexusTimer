'use client'
import PlayerMiniCard from '@/components/clash/player-mini-card/player-mini-card';
import { PlayerStatus } from '@/enums/PlayerStatus';

export interface LobbyPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  status?: PlayerStatus;
}

interface LobbyProps {
  players: LobbyPlayer[];
}

export default function Lobby({ players }: LobbyProps) {
  if (!players || players.length === 0) {
    return (
      <div className={'flex items-center justify-center w-full h-full text-sm text-muted-foreground'}>
        No hay jugadores en el lobby todavía.
      </div>
    )
  }

  return (
    <div className={'flex flex-wrap gap-2'}>
      {players.map((p) => (
        <PlayerMiniCard key={p.id} name={p.name} avatarUrl={p.avatarUrl} status={p.status}/>
      ))}
    </div>
  )
}

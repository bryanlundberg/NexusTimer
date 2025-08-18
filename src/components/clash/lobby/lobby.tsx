'use client'
import PlayerMiniCard from '@/components/clash/player-mini-card/player-mini-card';
import { PlayerPresence } from '@/interfaces/PlayerPresence';

interface LobbyProps {
  players: PlayerPresence[];
}

export default function Lobby({ players }: LobbyProps) {
  if (!players || players.length === 0) {
    return (
      <div className={'flex items-center justify-center w-full h-full text-sm text-muted-foreground'}>
        No players to show
      </div>
    )
  }

  return (
    <div className={'flex flex-wrap gap-2'}>
      {players.map((player) => (
        <PlayerMiniCard key={player.id} name={player.name} avatarUrl={player.image} status={player.status}/>
      ))}
    </div>
  )
}

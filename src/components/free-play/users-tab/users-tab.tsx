import PlayerMiniCard from '@/components/clash/player-mini-card/player-mini-card'
import useFreeMode from '@/hooks/useFreeMode'
import { useParams } from 'next/navigation'

export default function UsersTab() {
  const { roomId } = useParams()
  const { useUsersPresence } = useFreeMode()
  const cubersOnline = useUsersPresence(roomId?.toString() || '')
  return (
    <div className={'flex flex-wrap gap-2'}>
      {cubersOnline?.map((player) => (
        <PlayerMiniCard key={player.id} name={player.name} avatarUrl={player.image} />
      ))}
    </div>
  )
}

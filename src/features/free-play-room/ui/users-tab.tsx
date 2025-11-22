import useFreeMode from '@/hooks/useFreeMode'
import { useParams } from 'next/navigation'
import PlayerMiniCard from '@/features/free-play-room/ui/player-mini-card'

export default function UsersTab() {
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: '' }
  const { useUsersPresence } = useFreeMode()
  const cubersOnline = useUsersPresence(roomId?.toString() || '')
  return (
    <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4'}>
      {cubersOnline?.length &&
        cubersOnline?.map((player) => (
          <PlayerMiniCard
            key={Math.random()}
            name={player.name}
            avatarUrl={player.image || ''}
            status={player.status}
            id={player.id}
          />
        ))}
    </div>
  )
}

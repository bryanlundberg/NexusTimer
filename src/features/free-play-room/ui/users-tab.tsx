import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { useParams } from 'next/navigation'
import PlayerMiniCard from '@/features/free-play-room/ui/player-mini-card'
import { motion } from 'motion/react'

export default function UsersTab() {
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: '' }
  const { useUsersPresence } = useFreeMode()
  const cubersOnline = useUsersPresence(roomId?.toString() || '')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4 md:p-6">
      {cubersOnline?.length > 0 &&
        cubersOnline.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <PlayerMiniCard name={player.name} avatarUrl={player.image || ''} status={player.status} id={player.id} />
          </motion.div>
        ))}
    </div>
  )
}

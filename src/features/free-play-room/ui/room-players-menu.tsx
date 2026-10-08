import { UserX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import useAlert from '@/shared/model/useAlert'
import type { RoomPresence } from '@/features/free-play-room/model/room-view'
import { kickRoomPlayer } from '@/features/free-play-room/model/room-actions'

interface RoomPlayersMenuProps {
  players: RoomPresence[]
  selfId: string
}

export default function RoomPlayersMenu({ players, selfId }: RoomPlayersMenuProps) {
  const t = useTranslations('Multiplayer')
  const alert = useAlert()
  const others = players.filter((player) => player.id !== selfId)

  if (others.length === 0) return null

  const confirmKick = async (player: RoomPresence) => {
    const confirmed = await alert({
      title: t('kick-title', { name: player.name }),
      subtitle: t('kick-description'),
      confirmText: t('kick-confirm'),
      cancelText: t('join-private-room.cancel')
    })
    if (confirmed) kickRoomPlayer(player.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={t('kick')} className="size-7 shrink-0 pointer-coarse:size-10">
          <UserX className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel>{t('kick')}</DropdownMenuLabel>
        {others.map((player) => (
          <DropdownMenuItem key={player.id} onSelect={() => confirmKick(player)} className="gap-2">
            <Avatar className="size-6">
              {player.image && <AvatarImage className="object-cover" src={player.image} />}
              <AvatarFallback className="text-[10px]">{player.name[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate">{player.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

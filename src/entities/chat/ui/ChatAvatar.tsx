import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/shared/lib/utils'
import type { ChatPeer } from '@/entities/chat/model/types'

export function ChatAvatar({ peer, className }: { peer: ChatPeer; className?: string }) {
  return (
    <Avatar className={cn('size-8 rounded-lg', className)}>
      <AvatarImage className="object-cover" src={peer.image} alt={peer.name} />
      <AvatarFallback className="rounded-lg text-[10px] font-bold">
        {peer.name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

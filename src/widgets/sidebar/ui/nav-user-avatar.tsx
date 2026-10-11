import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import type { PresenceView } from '@/features/presence/model/usePresence'
import { cn } from '@/shared/lib/utils'
import { BackupRing } from '@/widgets/sidebar/ui/backup-ring'

interface NavUserAvatarProps {
  image: string
  initials: string
  presence: PresenceView
  percent: number
  isLast: boolean
}

export function NavUserAvatar({ image, initials, presence, percent, isLast }: NavUserAvatarProps) {
  return (
    <BackupRing percent={percent} isLast={isLast} className="size-9 pointer-coarse:size-10">
      <Avatar className="size-7 rounded-full">
        <AvatarImage className="object-cover" src={image} alt="" />
        <AvatarFallback className="rounded-full text-[10px] font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <span
        aria-hidden
        className={cn(
          'absolute inset-1 grid place-items-center rounded-full bg-background/90 text-[10px] font-semibold tabular-nums',
          'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'
        )}
      >
        {Math.round(percent)}%
      </span>
      <span className="pointer-events-none absolute right-0 bottom-0 rounded-full bg-background p-px">
        <PresenceDot state={presence} className="size-2" />
      </span>
    </BackupRing>
  )
}

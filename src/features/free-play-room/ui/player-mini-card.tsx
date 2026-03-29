import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { CheckCircle2, ExternalLink, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import Link from 'next/link'
import { TimerStatus } from '@/features/timer/model/enums'
import { useTranslations } from 'next-intl'

export interface PlayerMiniCardProps {
  name?: string
  avatarUrl?: string
  status?: TimerStatus
  id: string
}

const statusConfig: Partial<Record<TimerStatus, { label: string; className: string }>> = {
  [TimerStatus.SOLVING]: { label: 'status.solving', className: 'text-orange-500' },
  [TimerStatus.INSPECTING]: { label: 'status.inspecting', className: 'text-amber-500' },
  [TimerStatus.WAITING_NEXT_ROUND]: { label: 'status.done', className: 'text-emerald-500' },
  [TimerStatus.IDLE]: { label: 'status.idle', className: 'text-muted-foreground' },
  [TimerStatus.READY]: { label: 'status.ready', className: 'text-blue-500' },
  [TimerStatus.HOLDING]: { label: 'status.holding', className: 'text-pink-500' }
}

export default function PlayerMiniCard({ name, avatarUrl, status, id }: PlayerMiniCardProps) {
  const t = useTranslations('Multiplayer')

  if (!name || !id || !avatarUrl) {
    return null
  }

  const statusInfo = status ? statusConfig[status] : null

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      {/* Avatar with status overlay */}
      <div className="relative">
        <Avatar className="size-14 md:size-16">
          <AvatarImage src={avatarUrl} draggable={false} className="object-cover" />
          <AvatarFallback className="text-lg">{(name[0] || '?').toUpperCase()}</AvatarFallback>
        </Avatar>

        {status === TimerStatus.SOLVING && (
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
            <Image
              src="/animated/source.gif"
              alt="Solving"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {status === TimerStatus.INSPECTING && (
          <div className="absolute inset-0 w-full h-full bg-black/40 rounded-full flex items-center justify-center">
            <Eye className="size-4 text-white" />
          </div>
        )}

        {status === TimerStatus.WAITING_NEXT_ROUND && (
          <div className="absolute -bottom-1 -right-1">
            <CheckCircle2 className="size-5 text-emerald-500 fill-background" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center min-w-0 w-full">
        <p className="text-sm font-medium truncate">{name}</p>
        {statusInfo && <p className={`text-[11px] mt-0.5 ${statusInfo.className}`}>{t(statusInfo.label)}</p>}
      </div>

      {/* Profile link */}
      <Link href={`/people/${id}`} className="w-full">
        <Button variant="outline" size="sm" className="w-full text-xs h-8 rounded-lg">
          {t('view-profile')}
          <ExternalLink className="size-3 ml-1" />
        </Button>
      </Link>
    </div>
  )
}

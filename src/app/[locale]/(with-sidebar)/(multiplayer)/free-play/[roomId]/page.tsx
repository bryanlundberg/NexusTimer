'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import * as React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { useSession } from '@/shared/model/useSession'
import { useRouteSegment } from '@/shared/model/useRouteSegment'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Button } from '@/components/ui/button'
import { ChartBarIcon, CheckIcon, Clock, EyeIcon, Plus } from 'lucide-react'
import { AvatarGroup, AvatarGroupTooltip } from '@/components/ui/shadcn-io/avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import TimerTab from '@/features/free-play-room/ui/timer-tab'
import ResultsTab from '@/features/free-play-room/ui/results-tab'
import RoomCodeGate from '@/features/free-play-room/ui/room-code-gate'
import RoomTakenOver from '@/features/free-play-room/ui/room-taken-over'
import RoomCodeChip from '@/features/free-play-room/ui/room-code-chip'
import RoomPlayersMenu from '@/features/free-play-room/ui/room-players-menu'
import useAlert from '@/shared/model/useAlert'
import { useCountdown } from '@/shared/model/useCountdown'
import { TimerStatus } from '@/features/timer/model/enums'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { useRoomSession } from '@/features/free-play-room/model/useRoomSession'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'
import { toLocalTime, toPresence } from '@/features/free-play-room/model/room-view'
import type { RoomPhase } from '@/features/free-play-room/model/room-state'

const tabs = [
  { key: 'timer', icon: Clock },
  { key: 'results', icon: ChartBarIcon }
] as const

type TabKey = (typeof tabs)[number]['key']

const LEAVING_PHASES: Partial<Record<RoomPhase, string>> = {
  'not-found': 'room-not-found',
  kicked: 'kicked',
  banned: 'kicked',
  closed: 'room-closed',
  full: 'room-full',
  'upgrade-required': 'update-required'
}

const GATE_PHASES: RoomPhase[] = ['code-required', 'wrong-code', 'too-many-attempts']

export default function FreePlayRoomPage() {
  const t = useTranslations('Multiplayer')
  const roomId = useRouteSegment('/free-play') || null
  const { data: session } = useSession()
  const userId = session?.user?.id
  const router = useRouter()
  const alert = useAlert()
  const { join } = useRoomSession(roomId, Boolean(userId))

  const phase = useRoomStore((state) => state.phase)
  const joinedWithCode = useRoomStore((state) => state.joinedWithCode)
  const room = useRoomStore((state) => state.room)
  const clockOffset = useRoomStore((state) => state.clockOffset)

  const reset = useTimerStore((state) => state.reset)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const isSolving = useTimerStore((state) => state.isSolving)
  const timerStatus = useTimerStore((state) => state.timerStatus)

  useScreenWakeLock(isSolving || timerStatus === TimerStatus.INSPECTING)

  const onlineUsers = useMemo(() => toPresence(room), [room])
  const deadline = room ? toLocalTime(room.round.deadline, clockOffset) : undefined
  const { mmss, remainingMs } = useCountdown(deadline)
  const waitingScramble = room?.round.scramble === null
  const leaderId = room?.leaderId ?? null

  useEffect(() => {
    if (session === undefined) return
    if (!session) {
      alert({
        title: t('account-required'),
        subtitle: t('account-required-description'),
        confirmText: 'OK',
        hideCancel: true
      }).then(() => {
        router.push('/free-play')
      })
    }
  }, [session])

  useEffect(() => {
    const message = LEAVING_PHASES[phase]
    if (!message) return
    toast.error(t(message))
    router.push('/free-play')
  }, [phase])

  const previousLeader = useRef<string | null>(null)
  useEffect(() => {
    if (leaderId && previousLeader.current && leaderId !== previousLeader.current && leaderId === userId) {
      toast.success(t('now-leader'))
    }
    previousLeader.current = leaderId
  }, [leaderId, userId])

  useEffect(
    () => () => {
      setSolvingTime(0)
      reset()
    },
    [roomId]
  )

  const [currentTab, setCurrentTab] = React.useState<TabKey>('timer')

  const roundDurationMs = (room?.maxRoundTime ?? 0) * 1000
  const roundProgress =
    remainingMs !== undefined && roundDurationMs > 0 ? Math.min(1, Math.max(0, remainingMs / roundDurationMs)) : 0
  const isRoundEnding = remainingMs !== undefined && remainingMs <= 10_000

  const handleInvite = async () => {
    const shareData = {
      title: 'Nexus Timer',
      text: t('share-room-text'),
      url: window.location.href
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success(t('invite-link-copied'))
      })
    }
  }

  if (GATE_PHASES.includes(phase) || (phase === 'joining' && joinedWithCode)) {
    return (
      <RoomCodeGate
        error={
          phase === 'wrong-code'
            ? t('join-private-room.wrong-code')
            : phase === 'too-many-attempts'
              ? t('too-many-attempts')
              : null
        }
        submitting={phase === 'joining'}
        onSubmit={(code) => join(code)}
        onCancel={() => router.push('/free-play')}
      />
    )
  }

  if (phase === 'replaced' || phase === 'moved') {
    return (
      <RoomTakenOver
        movedToAnotherRoom={phase === 'moved'}
        onPlayHere={() => join()}
        onLeave={() => router.push('/free-play')}
      />
    )
  }

  if (phase !== 'joined' || !room || !userId) {
    return null
  }

  return (
    <div className="flex flex-col overflow-hidden h-dvh">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="btn-notch btn-notch-alt btn-notch-border size-9 shrink-0 pointer-coarse:size-10 [&_svg]:size-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={'/free-play'}>{t('title')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Users pill */}
        <div className="flex items-center gap-1 border border-border bg-muted/50 p-1.5">
          <AvatarGroup variant="css">
            {onlineUsers.map((user) => (
              <Avatar
                key={user.id}
                className={cn(
                  'relative size-7',
                  user.id === leaderId && 'ring-2 ring-amber-500',
                  !user.online && 'opacity-50'
                )}
              >
                {user.image && <AvatarImage className="object-cover" src={user.image} />}
                <AvatarFallback className="text-[10px]">{user.name?.[0]}</AvatarFallback>
                {user.status === TimerStatus.SOLVING && (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src="/utils/solving.webp"
                      unoptimized
                      alt="Solving"
                      width={28}
                      height={28}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
                {user.status === TimerStatus.INSPECTING && (
                  <div className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center">
                    <EyeIcon className="size-3 text-white" />
                  </div>
                )}
                {user.status === TimerStatus.WAITING_NEXT_ROUND && (
                  <div className="absolute inset-0 w-full h-full bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckIcon className="size-3 text-emerald-600" />
                  </div>
                )}
                <AvatarGroupTooltip>
                  <p>{user.name}</p>
                  {user.id === leaderId && <p className="text-xs text-primary-foreground">{t('leader')}</p>}
                  <p className="text-xs text-primary-foreground">
                    {user.status === TimerStatus.SOLVING && t('status.solving')}
                    {user.status === TimerStatus.INSPECTING && t('status.inspecting')}
                    {user.status === TimerStatus.WAITING_NEXT_ROUND && t('status.done')}
                    {user.status === TimerStatus.IDLE && t('status.idle')}
                  </p>
                </AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
          {userId === leaderId && <RoomPlayersMenu players={onlineUsers} selfId={userId} />}
          {room.private && room.code && <RoomCodeChip code={room.code} />}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t('invite')}
                className="size-7 shrink-0 pointer-coarse:size-10"
                onClick={handleInvite}
              >
                <Plus className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {t('invite')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Countdown */}
      <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-1.5 px-4 pb-3">
        {waitingScramble ? (
          <div className="text-center text-xs text-muted-foreground">{t('waiting-scramble')}</div>
        ) : (
          <motion.div
            className="text-center text-xs text-muted-foreground"
            key={mmss}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {t('next-round-starts-in')}{' '}
            <span
              className={`font-mono font-medium tabular-nums transition-colors ${isRoundEnding ? 'text-destructive' : 'text-foreground'}`}
            >
              {mmss}
            </span>
          </motion.div>
        )}
        <div className="h-1 w-full overflow-hidden bg-muted" aria-hidden>
          <div
            className={`h-full transition-[width,background-color] duration-1000 ease-linear motion-reduce:transition-none ${isRoundEnding ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${roundProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden mx-2 md:mx-4">
        <div className="h-full notch-bl-tr [--nblt:16px] border border-border bg-card overflow-hidden">
          <div className={`h-full overflow-y-auto ${currentTab !== 'timer' ? 'hidden' : ''}`}>
            <TimerTab maxRoundTime={room.maxRoundTime} event={room.event} onlineUsers={onlineUsers} />
          </div>
          <div className={`h-full overflow-y-auto ${currentTab !== 'results' ? 'hidden' : ''}`}>
            <ResultsTab />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="px-3 pt-3 pb-4 md:pb-3">
        <div role="tablist" className="chip-notch relative flex items-center bg-muted/60 p-1 md:max-w-xs md:mx-auto">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentTab(tab.key)}
                className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 md:py-2 text-sm font-medium z-10 transition-colors cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="chip-notch absolute inset-0 bg-background"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`size-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                  <span className={isActive ? 'text-foreground' : 'text-muted-foreground'}>{t(tab.key)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

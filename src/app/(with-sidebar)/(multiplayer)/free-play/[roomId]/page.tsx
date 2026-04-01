'use client'
import { useParams, useRouter } from 'next/navigation'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import genScramble from '@/shared/lib/timer/genScramble'
import { Button } from '@/components/ui/button'
import { ChartBarIcon, CheckIcon, Clock, EyeIcon, Plus, UsersIcon } from 'lucide-react'
import { AvatarGroup, AvatarGroupTooltip } from '@/components/ui/shadcn-io/avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import TimerTab from '@/features/free-play-room/ui/timer-tab'
import ResultsTab from '@/features/free-play-room/ui/results-tab'
import UsersTab from '@/features/free-play-room/ui/users-tab'
import useAlert from '@/shared/model/useAlert'
import { useCountdown } from '@/shared/model/useCountdown'
import { TimerStatus } from '@/features/timer/model/enums'
import { CubeCategory } from '@/shared/const/cube-categories'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AnimatePresence, motion } from 'motion/react'

const tabs = [
  { key: 'timer', icon: Clock },
  { key: 'results', icon: ChartBarIcon },
  { key: 'people', icon: UsersIcon }
] as const

type TabKey = (typeof tabs)[number]['key']

export default function FreePlayRoomPage() {
  const t = useTranslations('Multiplayer')
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: null }
  const { data: session } = useSession()
  const router = useRouter()
  const alert = useAlert()
  const {
    joinRoom,
    leaveRoom,
    useUsersPresence,
    useRoomRoundLimit,
    useRoomAuthority,
    useRoomEvent,
    updateRoomRoundLimit,
    updateRoomScramble,
    useRoomCurrentRound,
    incrementRoomRound
  } = useFreeMode()
  const onlineUsers = useUsersPresence(roomId?.toString() || '')
  const reset = useTimerStore((state) => state.reset)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const isSolving = useTimerStore((state) => state.isSolving)
  const timerStatus = useTimerStore((state) => state.timerStatus)
  const roundLimit = useRoomRoundLimit(roomId?.toString() || '')
  const currentRound = useRoomCurrentRound(roomId?.toString() || '')

  useScreenWakeLock(isSolving || timerStatus === TimerStatus.INSPECTING)
  const { mmss, isFinished } = useCountdown(roundLimit || 0)
  const roomAuthority = useRoomAuthority(roomId?.toString() || '')
  const event = useRoomEvent(roomId?.toString() || '')
  const maxRoundTime = useFreeMode().useMaxRoundTime(roomId?.toString() || '')

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
    if (!roomId || !session?.user?.id) return
    joinRoom(roomId.toString(), session.user.id)

    return () => {
      if (roomId && session?.user?.id) {
        leaveRoom(roomId.toString(), session.user.id)
        setSolvingTime(0)
        reset()
      }
    }
  }, [roomId, session?.user?.id])

  const handledRoundRef = useRef<number | null>(null)
  useEffect(() => {
    if (!roomId || !session?.user?.id) return
    if (!isFinished) return
    if (!roomAuthority) return
    if (session.user.id !== roomAuthority) return
    if (!event) return
    if (!maxRoundTime) return

    if (handledRoundRef.current === (roundLimit ?? null)) return
    handledRoundRef.current = roundLimit ?? null

    const durationMs = maxRoundTime * 1000
    const newScramble = genScramble(event as CubeCategory)
    updateRoomScramble(roomId.toString(), newScramble)
    updateRoomRoundLimit(roomId.toString(), durationMs)
    incrementRoomRound(roomId.toString(), currentRound + 1)
  }, [isFinished, roomAuthority, session?.user?.id, roomId, currentRound])

  const [currentTab, setCurrentTab] = React.useState<TabKey>('timer')

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
      const url = window.location.href
      navigator.clipboard.writeText(url).then(() => {
        toast.success(t('invite-link-copied'))
      })
    }
  }

  return (
    <div className="flex flex-col overflow-hidden h-dvh">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
        <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1.5">
          <AvatarGroup variant="css">
            {onlineUsers.map((user, index) => (
              <Avatar key={index} className="relative size-7">
                <AvatarImage className="object-cover" src={user.image || ''} />
                <AvatarFallback className="text-[10px]">{user.name?.[0]}</AvatarFallback>
                {user.status === TimerStatus.SOLVING && (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src="/animated/source.gif"
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
                  <p className="text-xs text-primary-foreground">
                    {user.status === TimerStatus.SOLVING && t('status.solving')}
                    {user.status === TimerStatus.INSPECTING && t('status.inspecting')}
                    {user.status === TimerStatus.WAITING_NEXT_ROUND && t('status.done')}
                    {user.status === TimerStatus.IDLE && t('status.idle')}
                    {user.status === TimerStatus.READY && t('status.ready')}
                    {user.status === TimerStatus.HOLDING && t('status.holding')}
                  </p>
                </AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full size-7 shrink-0" onClick={handleInvite}>
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
      <motion.div
        className="text-center text-xs text-muted-foreground pb-2"
        key={mmss}
        initial={{ opacity: 0.5, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {t('next-round-starts-in')} <span className="font-mono font-medium text-foreground">{mmss}</span>
      </motion.div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden mx-2 md:mx-4">
        <div className="h-full rounded-xl border border-border bg-card overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              className="h-full overflow-y-auto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {currentTab === 'timer' && (
                <TimerTab maxRoundTime={maxRoundTime} event={event} onlineUsers={onlineUsers} />
              )}
              {currentTab === 'results' && <ResultsTab />}
              {currentTab === 'people' && <UsersTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tab bar — mobile: full-width pill bar, desktop: compact centered */}
      <div className="px-3 pt-3 pb-4 md:pb-3">
        <div className="relative flex items-center bg-muted/60 rounded-xl p-1 md:max-w-xs md:mx-auto">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 md:py-2 text-sm font-medium z-10 transition-colors cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-background rounded-lg shadow-sm"
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

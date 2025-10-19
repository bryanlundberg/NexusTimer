'use client'
import { useParams } from 'next/navigation'
import useFreeMode from '@/hooks/useFreeMode'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import TimerTab from '@/components/free-play/timer-tab/timer-tab'
import UsersTab from '@/components/free-play/users-tab/users-tab'
import ResultsTab from '@/components/free-play/results-tab/results-tab'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/store/timerStore'
import { useCountdown } from '@/hooks/useCountdown'
import genScramble from '@/lib/timer/genScramble'
import { Categories } from '@/interfaces/Categories'
import { Button } from '@/components/ui/button'
import { ChartBarIcon, Clock, UsersIcon } from 'lucide-react'
import { AvatarGroup, AvatarGroupTooltip } from '@/components/ui/shadcn-io/avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TimerStatus } from '@/enums/TimerStatus'
import Image from 'next/image'

export default function Page() {
  const { roomId } = useParams()
  const { data: session } = useSession()
  const {
    joinRoom,
    leaveRoom,
    useUsersPresence,
    useRoomRoundLimit,
    useRoomAuthority,
    useRoomEvent,
    updateRoomRoundLimit,
    updateRoomScramble
  } = useFreeMode()
  const onlineUsers = useUsersPresence(roomId?.toString() || '')
  const reset = useTimerStore((state) => state.reset)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const roundLimit = useRoomRoundLimit(roomId?.toString() || '')
  const { mmss, isFinished } = useCountdown(roundLimit || 0)
  const roomAuthority = useRoomAuthority(roomId?.toString() || '')
  const event = useRoomEvent(roomId?.toString() || '')
  const maxRoundTime = useFreeMode().useMaxRoundTime(roomId?.toString() || '')

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
    const newScramble = genScramble(event as Categories)
    updateRoomScramble(roomId.toString(), newScramble)
    updateRoomRoundLimit(roomId.toString(), durationMs)
  }, [isFinished, roomAuthority, session?.user?.id, roomId])

  const [currentTab, setCurrentTab] = React.useState<string>('timer')

  return (
    <div className="pt-4 px-4 md:pb-4 flex flex-col overflow-hidden h-dvh">
      <div className={'flex justify-between items-start h-fit'}>
        <div className="flex items-center gap-2 mb-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={'/free-play'}>Free Play</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="bg-gradient-to-r from-primary via-card to-primary p-0.5 rounded-full">
          <div className="bg-gradient-to-r from-background via-muted to-card p-1.5 rounded-full">
            <AvatarGroup variant="css">
              {onlineUsers.map((user, index) => (
                <Avatar key={index} className={'relative'}>
                  <AvatarImage className={'object-cover'} src={user.image || ''} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                  {user.status === TimerStatus.SOLVING && (
                    <div className={'absolute inset-0 w-full h-full'}>
                      <Image
                        src="/animated/source.gif"
                        alt="Solving"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <AvatarGroupTooltip>
                    <p>{user.name}</p>
                  </AvatarGroupTooltip>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>

      <div>
        <div className={'text-center text-xs mb-4'}>Next round starts in: {mmss}</div>
      </div>

      <div className="flex grow bg-card rounded-md border border-muted h-full overflow-hidden min-h-0">
        <div className="w-full overflow-y-auto min-h-0">
          {currentTab === 'timer' && <TimerTab maxRoundTime={maxRoundTime} event={event} onlineUsers={onlineUsers} />}
          {currentTab === 'results' && <ResultsTab />}
          {currentTab === 'people' && <UsersTab />}
        </div>
      </div>

      <div className={'grid grid-cols-3 gap-2 mt-3 mb-4 md:mb-2'}>
        <Button variant={currentTab === 'timer' ? 'default' : 'secondary'} onClick={() => setCurrentTab('timer')}>
          <Clock /> Timer
        </Button>
        <Button variant={currentTab === 'results' ? 'default' : 'secondary'} onClick={() => setCurrentTab('results')}>
          <ChartBarIcon /> Results
        </Button>
        <Button variant={currentTab === 'people' ? 'default' : 'secondary'} onClick={() => setCurrentTab('people')}>
          <UsersIcon /> People
        </Button>
      </div>
    </div>
  )
}

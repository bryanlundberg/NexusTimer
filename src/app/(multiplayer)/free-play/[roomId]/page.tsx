'use client'
import { useParams } from 'next/navigation'
import useFreeMode from '@/hooks/useFreeMode'
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/ui/shadcn-io/tabs'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import TimerTab from '@/components/free-play/timer-tab/timer-tab'
import UsersTab from '@/components/free-play/users-tab/users-tab'
import ResultsTab from '@/components/free-play/results-tab/results-tab'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/store/timerStore'
import { useCountdown } from '@/hooks/useCountdown'

export default function Page() {
  const { roomId } = useParams()
  const { data: session } = useSession()
  const { joinRoom, leaveRoom, useUsersPresence, useRoomRoundLimit } = useFreeMode()
  const onlineUsers = useUsersPresence(roomId?.toString() || '')
  const reset = useTimerStore((state) => state.reset)
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime)
  const roundLimit = useRoomRoundLimit(roomId?.toString() || '')
  const { mmss } = useCountdown(roundLimit || 0)

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

  return (
    <div className="pt-4 px-4 md:pb-4 h-full flex flex-col">
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
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <BreadcrumbItem>{roomId}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Online:</span>
          <span className="font-medium">{onlineUsers ? Object.keys(onlineUsers).length : 0}</span>
        </div>
      </div>

      <div>
        <div className={'text-center text-xs mb-4'}>Next round starts in: {mmss}</div>
      </div>
      <Tabs defaultValue="timer" className="bg-muted rounded-lg flex-1 px-2 pt-2 pb-2">
        <TabsContents className="rounded-sm bg-background h-full">
          <TabsContent value="timer" className="space-y-6 p-6">
            <TimerTab />
          </TabsContent>
          <TabsContent value="results" className="space-y-6 p-6">
            <ResultsTab />
          </TabsContent>
          <TabsContent value="people" className="space-y-6 p-6">
            <UsersTab />
          </TabsContent>
        </TabsContents>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value={'people'}>People</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

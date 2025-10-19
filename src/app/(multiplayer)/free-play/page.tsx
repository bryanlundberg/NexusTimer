'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CreateRoomModal from '@/components/free-play/create-room-modal/create-room-modal'
import useFreeMode from '@/hooks/useFreeMode'
import formatTime from '@/lib/formatTime'
import { Users, Clock, Box } from 'lucide-react'
import { format } from 'date-fns'
import { useMemo } from 'react'

export default function FreePlayPage() {
  const { useRooms } = useFreeMode()
  const rooms = useRooms()

  const displayRooms = useMemo(
    () => (rooms ? rooms.filter((room: any) => room?.presence && Object.keys(room.presence).length > 0) : []),
    [rooms]
  )
  return (
    <div className="p-4">
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

      <div className={'flex flex-col items-center justify-center gap-2'}>
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight">Free Play</h1>

        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
          Join real-time cubing sessions with other enthusiasts. A casual space where you can practice freely without
          the pressure of rankings or records.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button className={'mx-auto'}>New Room</Button>
          </DialogTrigger>
          <CreateRoomModal />
        </Dialog>
      </div>

      <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'}>
        {displayRooms.length > 0 &&
          displayRooms.map((room: any) => (
            <Link key={room.roomId} href={`/free-play/${room.roomId}`} className="no-underline">
              <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-primary cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold truncate">{room.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Users online:</span>
                    <span className="font-semibold">{room?.presence ? Object.keys(room.presence).length : 0}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-semibold">{room.event}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Max Time per Round:</span>
                    <span className="font-semibold">{formatTime(room.maxRoundTime * 1000)}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{format(new Date(room.createdAt), 'PPpp')}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}

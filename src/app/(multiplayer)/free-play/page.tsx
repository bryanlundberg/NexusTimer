'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CreateRoomModal from '@/components/free-play/create-room-modal/create-room-modal'
import RoomCard from '@/components/free-play/room-card/room-card'
import useFreeMode from '@/hooks/useFreeMode'
import { useMemo, useState } from 'react'
import { CubeIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function FreePlayPage() {
  const { useRooms } = useFreeMode()
  const rooms = useRooms()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayRooms = useMemo(
    () => (rooms ? rooms.filter((room: any) => room?.presence && Object.keys(room.presence).length > 0) : []),
    [rooms]
  )
  return (
    <ScrollArea className="p-4 overflow-auto h-dvh">
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className={'mx-auto'}>New Room</Button>
          </DialogTrigger>
          <CreateRoomModal />
        </Dialog>
      </div>

      {displayRooms.length > 0 ? (
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'}>
          {displayRooms.map((room: any) => (
            <RoomCard key={room.roomId} room={room} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center mt-16 mb-8 w-fit mx-auto p-6 bg-secondary/20 border-2 border-dashed border-secondary">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
            <div className="relative bg-primary/1 text-primary-foreground p-8 rounded-full">
              <CubeIcon className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">No Active Rooms Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Be the first to start a cubing session! Create a room and invite others to join you for some casual
            practice.
          </p>
        </Card>
      )}
    </ScrollArea>
  )
}

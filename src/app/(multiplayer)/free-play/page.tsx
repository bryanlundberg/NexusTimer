'use client'
import { useSession } from 'next-auth/react'
import { usePresence } from '@/hooks/usePresence'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CreateRoomModal from '@/components/free-play/create-room-modal/create-room-modal'
import useFreeMode from '@/hooks/useFreeMode'

export default function FreePlayPage() {
  const { data: session } = useSession()
  usePresence(session?.user?.id)
  const { useRooms } = useFreeMode()
  const rooms = useRooms()

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

      <Dialog>
        <DialogTrigger asChild>
          <Button>New Room</Button>
        </DialogTrigger>
        <CreateRoomModal />
      </Dialog>

      {rooms.length > 0 &&
        rooms.map((room: any) => (
          <Link key={room.roomId} href={`/free-play/${room.roomId}`} className="no-underline">
            <Card key={room.roomId} className="p-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Room ID: {room.roomId}</h3>
                  <p>Status: {room.status}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
    </div>
  )
}

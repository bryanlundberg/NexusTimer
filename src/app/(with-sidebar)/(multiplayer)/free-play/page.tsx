'use client'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { CubeIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import FreePlayHeader from '@/widgets/navigation-header/ui/FreePlayHeader'
import CreateRoomModal from '@/features/free-play/ui/create-room-modal'
import RoomCard from '@/features/free-play/ui/room-card'
import { useTranslations } from 'next-intl'

export default function FreePlayPage() {
  const t = useTranslations('Multiplayer')
  const { useRooms } = useFreeMode()
  const rooms = useRooms()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayRooms = useMemo(
    () => (rooms ? rooms.filter((room: any) => room?.presence && Object.keys(room.presence).length > 0) : []),
    [rooms]
  )

  return (
    <ScrollArea className="p-4 overflow-auto h-dvh">
      <FreePlayHeader />

      <div className={'flex flex-col items-center justify-center gap-2'}>
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight">{t('title')}</h1>

        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">{t('description')}</p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className={'mx-auto'}>{t('new-room')}</Button>
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

          <h2 className="text-2xl font-bold text-center mb-2">{t('no-active-rooms')}</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">{t('no-active-rooms-description')}</p>
        </Card>
      )}
    </ScrollArea>
  )
}

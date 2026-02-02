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
    <ScrollArea className="overflow-auto h-dvh">
      <FreePlayHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-start gap-4 mb-12">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-2">
            Beta Multiplayer
          </div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{t('title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{t('description')}</p>
          <div className="flex gap-4 mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                  {t('new-room')}
                </Button>
              </DialogTrigger>
              <CreateRoomModal />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Available Rooms</h2>
              <div className="text-sm text-muted-foreground">{displayRooms.length} rooms active now</div>
            </div>

            {displayRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayRooms.map((room: any) => (
                  <RoomCard key={room.roomId} room={room} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center py-12 px-6 bg-muted/30 border-dashed border-2">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                  </div>
                  <CubeIcon className="h-12 w-12 text-primary/40 relative" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('no-active-rooms')}</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">{t('no-active-rooms-description')}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full" />
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                How to Play?
              </h3>
              <ul className="space-y-4 text-sm relative z-10">
                <li className="flex gap-3">
                  <span className="font-mono text-primary font-bold">01.</span>
                  <span>Create or join a room.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-primary font-bold">02.</span>
                  <span>Prepare your cube and wait the round to start.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-primary font-bold">03.</span>
                  <span>Solve the cube as fast as possible.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

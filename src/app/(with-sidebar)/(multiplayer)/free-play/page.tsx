'use client'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { ScrollArea } from '@/components/ui/scroll-area'
import FreePlayHeader from '@/widgets/navigation-header/ui/FreePlayHeader'
import CreateRoomModal from '@/features/free-play/ui/create-room-modal'
import RoomCard from '@/features/free-play/ui/room-card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Plus, Radio, Gamepad2 } from 'lucide-react'

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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              <Radio className="size-3" />
              Beta
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">{t('title')}</h1>
          <p className="text-muted-foreground max-w-lg mb-6">{t('description')}</p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="gap-2">
                <Plus className="size-4" />
                {t('new-room')}
              </Button>
            </DialogTrigger>
            <CreateRoomModal />
          </Dialog>
        </motion.div>

        {/* Rooms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{t('available-rooms')}</h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t('active-rooms-count', { count: displayRooms.length })}
                </span>
              </div>

              {displayRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayRooms.map((room: any, i: number) => (
                    <motion.div
                      key={room.roomId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <RoomCard room={room} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-muted-foreground/20"
                >
                  <Gamepad2 className="size-10 text-muted-foreground/30 mb-4" />
                  <h3 className="text-base font-semibold mb-1">{t('no-active-rooms')}</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    {t('no-active-rooms-description')}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-4">{t('how-to-play.title')}</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {(['step1', 'step2', 'step3'] as const).map((step, i) => (
                  <li key={step} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 size-5 rounded-full border border-border flex items-center justify-center text-[10px] font-semibold text-foreground">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{t(`how-to-play.${step}`)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.aside>
        </div>
      </div>
    </ScrollArea>
  )
}

'use client'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useRoomLobby } from '@/features/free-play/model/useRoomLobby'
import { ScrollArea } from '@/components/ui/scroll-area'
import FreePlayHeader from '@/widgets/navigation-header/ui/FreePlayHeader'
const CreateRoomModal = dynamic(() => import('@/features/free-play/ui/create-room-modal'))
const JoinPrivateRoomModal = dynamic(() => import('@/features/free-play/ui/join-private-room-modal'))
import RoomCard from '@/features/free-play/ui/room-card'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Plus, Gamepad2 } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useSession } from '@/shared/model/useSession'
import { useRouter } from '@/shared/config/i18n/navigation'
import useAlert from '@/shared/model/useAlert'
import type { RoomSummary } from '@nexustimer/contracts'

export default function FreePlayPage() {
  const t = useTranslations('Multiplayer')
  const tAuth = useTranslations('Index.Auth')
  const displayRooms = useRoomLobby()
  const open = useOverlayStore((store) => store.open)
  const { status } = useSession()
  const router = useRouter()
  const alert = useAlert()

  const ensureAccount = async () => {
    if (status !== 'unauthenticated') return true
    const goToSignIn = await alert({
      title: t('account-required'),
      subtitle: t('account-required-description'),
      confirmText: tAuth('sign-in')
    })
    if (goToSignIn) router.push('/sign-in')
    return false
  }

  const handleCreateRoom = async () => {
    if (!(await ensureAccount())) return
    open({ id: 'create-room', component: <CreateRoomModal /> })
  }

  const handleJoinPrivate = async (room: RoomSummary) => {
    if (!(await ensureAccount())) return
    open({
      id: 'join-private-room',
      component: <JoinPrivateRoomModal room={{ roomId: room.roomId, name: room.name }} />
    })
  }

  return (
    <ScrollArea className="overflow-auto h-dvh" overscrollStretch>
      <FreePlayHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-12"
        >
          {displayRooms.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {t('active-rooms-count', { count: displayRooms.length })}
              </span>
            </div>
          )}

          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl mb-2">{t('title')}</h1>
          <p className="text-muted-foreground max-w-lg mb-6">{t('description')}</p>

          <Button size="default" className="gap-2 pointer-coarse:h-11" onClick={handleCreateRoom}>
            <Plus className="size-4" />
            {t('new-room')}
          </Button>
        </motion.div>

        {/* Rooms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="size-2 shrink-0 rounded-[2px] bg-cube-red" aria-hidden />
                <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                  {t('available-rooms')}
                </h2>
                <span aria-hidden className="h-px min-w-4 flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              {displayRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayRooms.map((room, i) => (
                    <motion.div
                      key={room.roomId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <RoomCard room={room} onJoinPrivate={room.private ? () => handleJoinPrivate(room) : undefined} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col items-center justify-center py-16 px-6 notch-bl-tr [--nblt:16px] border border-dashed border-muted-foreground/20"
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
            <div className="algo-panel-notch p-5">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80 mb-4">
                {t('how-to-play.title')}
              </h3>
              <div className="relative">
                <span aria-hidden className="absolute left-3 top-6 bottom-6 w-px bg-border" />
                <ol className="relative space-y-4 text-sm text-muted-foreground">
                  {(
                    [
                      ['step1', 'var(--cube-blue)'],
                      ['step2', 'var(--cube-green)'],
                      ['step3', 'var(--cube-red)']
                    ] as const
                  ).map(([step, color], i) => (
                    <li key={step} className="relative flex gap-3 items-start">
                      <span
                        className="chip-notch chip-notch-sm flex size-6 shrink-0 items-center justify-center font-display text-[11px] font-bold"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${color} 18%, var(--background))`,
                          color: `color-mix(in oklch, ${color} 65%, var(--foreground))`
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{t(`how-to-play.${step}`)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </ScrollArea>
  )
}

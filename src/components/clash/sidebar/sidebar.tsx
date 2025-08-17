'use client'
import { ArrowLeft, MessageSquare, RotateCcw, Shuffle, Users } from 'lucide-react'
import RealtimePill from '@/components/clash/real-time/realtime-pill'
import { useClashWindows } from '@/store/clash-windows'
import PlayerMiniCard from '../player-mini-card/player-mini-card'

export default function Sidebar() {
  const chat = useClashWindows((s) => s.chat)
  const scrambleOpen = useClashWindows((s) => s.scramble.isOpen)
  const lobbyOpen = useClashWindows((s) => s.lobby.isOpen)
  const toggle = useClashWindows((s) => s.toggle)
  const resetAll = useClashWindows((s) => s.resetAll)

  const itemBase =
    'flex flex-col items-center justify-center cursor-pointer hover:bg-sidebar-primary/20 select-none'

  return (
    <aside className="flex flex-col bg-sidebar-primary/20 text-sidebar-foreground w-24 md:max-w-36 shrink-0">
      <PlayerMiniCard/>

      <div className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1`}>
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5"/>
        EXIT
      </div>

      <div
        role="button"
        onClick={() => toggle('chat')}
        className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
          chat.isOpen ? 'bg-sidebar-primary/30' : ''
        }`}
      >
        <MessageSquare className="w-4 h-4 md:w-5 md:h-5"/>
        CHAT
      </div>

      <div
        role="button"
        onClick={() => toggle('scramble')}
        className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
          scrambleOpen ? 'bg-sidebar-primary/30' : ''
        }`}
      >
        <Shuffle className="w-4 h-4 md:w-5 md:h-5"/>
        SCRAMBLE
      </div>

      <div
        role="button"
        onClick={() => toggle('lobby')}
        className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
          lobbyOpen ? 'bg-sidebar-primary/30' : ''
        }`}
      >
        <Users className="w-4 h-4 md:w-5 md:h-5"/>
        LOBBY
      </div>

      <div
        role="button"
        onClick={resetAll}
        className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1`}
      >
        <RotateCcw className="w-4 h-4 md:w-5 md:h-5"/>
        RESET UI
      </div>

      <div className="mx-auto mt-auto mb-3">
        <RealtimePill/>
      </div>
    </aside>
  )
}

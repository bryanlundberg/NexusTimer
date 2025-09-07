'use client'
import { ArrowLeft, MessageSquare, RotateCcw, Shuffle, Users } from 'lucide-react'
import { useClashWindows } from '@/store/clash-windows'
import { useRoomUtils } from '@/hooks/useRoomUtils';
import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Sidebar() {
  const { data: session } = useSession();
  const room = useClashManager((state) => state.room)
  const chat = useClashWindows((s) => s.chat)
  const scrambleOpen = useClashWindows((s) => s.scramble.isOpen)
  const lobbyOpen = useClashWindows((s) => s.lobby.isOpen)
  const toggle = useClashWindows((s) => s.toggle)
  const resetAll = useClashWindows((s) => s.resetAll)
  const { handleLeaveClash } = useRoomUtils();
  const itemBase =
    'flex flex-col items-center justify-center cursor-pointer hover:bg-sidebar-primary/20 select-none'

  return (
    <aside className="flex flex-col bg-sidebar text-sidebar-foreground w-20 md:max-w-20 shrink-0">
      <SidebarTrigger className={"p-2 md:p-4 mx-auto my-5"}/>

      <NavButton
        onClick={() => handleLeaveClash(room!, session!)}
        className={`${itemBase} p-2 md:p-4 md:text-xs gap-1`}
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5"/>
        EXIT
      </NavButton>


      <NavButton
        onClick={() => toggle('chat')} className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
        chat.isOpen ? 'bg-sidebar-primary/30' : ''
      }`}
      >
        <MessageSquare className="w-4 h-4 md:w-5 md:h-5"/>
        CHAT
      </NavButton>

      <NavButton
        onClick={() => toggle('scramble')} className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
        scrambleOpen ? 'bg-sidebar-primary/30' : ''
      }`}
      >
        <Shuffle className="w-4 h-4 md:w-5 md:h-5"/>
        SCRAMBLE
      </NavButton>

      <NavButton
        onClick={() => toggle('lobby')} className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1 ${
        lobbyOpen ? 'bg-sidebar-primary/30' : ''
      }`}
      >
        <Users className="w-4 h-4 md:w-5 md:h-5"/>
        LOBBY
      </NavButton>

      <NavButton onClick={resetAll} className={`${itemBase} p-2 md:p-4 text-[10px] md:text-xs gap-1`}>
        <RotateCcw className="w-4 h-4 md:w-5 md:h-5"/>
        RESET UI
      </NavButton>
    </aside>
  )
}

interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

function NavButton({ children, ...rest }: NavButtonProps) {
  return (
    <button
      {...rest}
      className={cn('p-2 md:p-4 text-[10px] md:text-xs gap-1', rest.className)}
    >
      {children}
    </button>
  )
}

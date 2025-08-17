'use client'
import React from 'react';
import { Hourglass } from 'lucide-react';
import { cubeCollection } from '@/lib/const/cubeCollection';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Rnd } from 'react-rnd';
import ScrambleDisplayDraggable from '@/components/clash/scramble-display-draggable/scramble-display-draggable';
import { useClashWindows } from '@/store/clash-windows';
import Sidebar from '@/components/clash/sidebar/sidebar';
import Lobby from '@/components/clash/lobby/lobby';
import { PlayerStatus } from '@/enums/PlayerStatus';
import Chat from '@/components/clash/chat/chat';
import { useClashManager } from '@/store/ClashManager';
import { useCountdown } from '@/hooks/useCountdown';

const mockedPlayers = [
  { id: '1', name: 'Rednaxela', avatarUrl: 'https://github.com/shadcn.png', status: PlayerStatus.PREPARING as const },
  { id: '2', name: 'CubeLord', avatarUrl: 'https://i.pravatar.cc/100?img=5', status: PlayerStatus.PREPARING as const },
  { id: '3', name: 'Speedy', avatarUrl: 'https://i.pravatar.cc/100?img=8', status: PlayerStatus.FINISHED as const },
  { id: '4', name: 'Twister', avatarUrl: 'https://i.pravatar.cc/100?img=15', status: PlayerStatus.SOLVING as const },
  { id: '5', name: 'LayerByLayer', avatarUrl: 'https://i.pravatar.cc/100?img=20', status: PlayerStatus.SOLVING as const },
  { id: '6', name: 'CornerFirst', avatarUrl: 'https://i.pravatar.cc/100?img=25', status: PlayerStatus.FINISHED as const },
  { id: '7', name: 'PLLMaster', avatarUrl: 'https://i.pravatar.cc/100?img=30', status: PlayerStatus.FINISHED as const },
  { id: '8', name: 'F2LPro', avatarUrl: 'https://i.pravatar.cc/100?img=35', status: PlayerStatus.PREPARING as const },
];

export default function MatchStarted() {
  const chat = useClashWindows((s) => s.chat);
  const lobby = useClashWindows((s) => s.lobby);
  const setPosition = useClashWindows((s) => s.setPosition);
  const setSize = useClashWindows((s) => s.setSize);
  const room = useClashManager(state => state.room);
  const { mmss } = useCountdown(room?.matchFinalizationTime);

  return (
    <div className={'flex w-full min-h-dvh max-h-dvh overflow-hidden'}>
      <Sidebar/>

      <div className={'w-full flex flex-col'}>
        <div className={'p-1 flex flex-wrap items-center gap-2 text-xs px-4 pt-2 text-muted-foreground'}>
          <Image src={cubeCollection[0].src} alt={'Clash Icon'} width={20} height={20}/>
          <span>3x3</span>
          <span>| Clash Started |</span>
          <span className={'flex items-center gap-1'}> <Hourglass size={14} fill={'#fff'}/> {mmss}</span>
        </div>

        <div className={'flex flex-col justify-start items-center h-full'}>
          <div className={'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'}>Round 3/5</div>
          <div className={'px-4 text-center md:text-2xl 2xl:text-3xl'}>D2 F&#39; L U R2 F U F&#39; U B2 L2 U L2 U F2 U&#39; R2 D2 F2
            D L
          </div>
          <div className={'text-4xl md:text-5xl lg:text-6xl xl:text-9xl grow flex items-center-safe justify-center w-full'}>9.91</div>
          <div className={'pb-3 flex gap-2'}>
            <Button variant={'destructive'}>DNF</Button>
            <Button variant={'outline'}>+2</Button>
          </div>
        </div>

        {chat.isOpen && (
          <Rnd
            className={'z-0 rounded-md bg-card border border-border'}
            default={{
              x: chat.x,
              y: chat.y,
              width: chat.width,
              height: chat.height,
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            onDragStop={(e, d) => setPosition('chat', d.x, d.y)}
            onResizeStop={(e, dir, ref, delta, position) => {
              const width = parseFloat(ref.style.width);
              const height = parseFloat(ref.style.height);
              setSize('chat', width, height);
              setPosition('chat', position.x, position.y);
            }}
          >
            <Chat/>
          </Rnd>
        )}

        {lobby.isOpen && (
          <Rnd
            className={'z-0 rounded-md bg-card border border-border'}
            default={{
              x: lobby.x,
              y: lobby.y,
              width: lobby.width,
              height: lobby.height,
            }}
            minWidth={240}
            minHeight={120}
            bounds="parent"
            onDragStop={(e, d) => setPosition('lobby', d.x, d.y)}
            onResizeStop={(e, dir, ref, delta, position) => {
              const width = parseFloat(ref.style.width);
              const height = parseFloat(ref.style.height);
              setSize('lobby', width, height);
              setPosition('lobby', position.x, position.y);
            }}
          >
            <div className={'p-2 overflow-auto h-full'}>
              <Lobby players={mockedPlayers}/>
            </div>
          </Rnd>
        )}

        <ScrambleDisplayDraggable/>
      </div>
    </div>
  )
}

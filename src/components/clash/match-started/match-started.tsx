'use client'
import React, { useMemo } from 'react';
import { Hourglass } from 'lucide-react';
import { cubeCollection } from '@/lib/const/cubeCollection';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Rnd } from 'react-rnd';
import ScrambleDisplayDraggable from '@/components/clash/scramble-display-draggable/scramble-display-draggable';
import { useClashWindows } from '@/store/clash-windows';
import Sidebar from '@/components/clash/sidebar/sidebar';
import Lobby from '@/components/clash/lobby/lobby';
import Chat from '@/components/clash/chat/chat';
import { useClashManager } from '@/store/ClashManager';
import { useCountdown } from '@/hooks/useCountdown';

export default function MatchStarted() {
  const chat = useClashWindows((s) => s.chat);
  const lobby = useClashWindows((s) => s.lobby);
  const setPosition = useClashWindows((s) => s.setPosition);
  const setSize = useClashWindows((s) => s.setSize);
  const room = useClashManager(state => state.room);
  const { mmss } = useCountdown(room?.matchFinalizationTime);

  const players = useMemo(() => {
    return Object.values(room?.presence || {}).map((user) => user);
  }, [room?.presence]);

  const selectedCube = useMemo(() => {
    const byName = cubeCollection.find((c) => c.name === room?.event);
    const defaultThree = cubeCollection.find((c) => c.name === '3x3') || cubeCollection[0];
    return byName || defaultThree;
  }, [room?.event]);

  return (
    <div className={'flex w-full min-h-dvh max-h-dvh overflow-hidden'}>
      <Sidebar/>

      <div className={'w-full flex flex-col'}>
        <div className={'p-1 flex flex-wrap items-center gap-2 text-xs px-4 pt-2 text-muted-foreground'}>
          <Image src={selectedCube?.src} alt={'Clash Icon'} width={20} height={20}/>
          <span>{selectedCube?.name ?? room?.event ?? '3x3'}</span>
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
            dragHandleClassName={'chat-drag-handle'}
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
              <Lobby players={players}/>
            </div>
          </Rnd>
        )}

        <ScrambleDisplayDraggable/>
      </div>
    </div>
  )
}

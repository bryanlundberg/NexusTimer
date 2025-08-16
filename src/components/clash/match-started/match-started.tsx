'use client'
import PlayerMiniCard from '../player-mini-card/player-mini-card';
import { ArrowLeft, Hourglass } from 'lucide-react';
import RealtimePill from '@/components/clash/real-time/realtime-pill';
import { cubeCollection } from '@/lib/const/cubeCollection';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function MatchStarted() {
  return (
    <div className={'flex w-full min-h-dvh max-h-dvh overflow-hidden'}>
      <div className={'flex flex-col bg-sidebar-primary/20 text-sidebar-foreground max-w-36'}>
        <PlayerMiniCard/>
        <div className={'flex flex-col items-center justify-center p-4 hover:bg-sidebar-primary/20'}>
          <ArrowLeft/>
          EXIT
        </div>
        <div className={'mx-auto mt-auto mb-3'}><RealtimePill/></div>
      </div>

      <div className={'w-full flex flex-col'}>
        <div className={'p-1 flex flex-wrap items-center gap-2 text-xs px-4 pt-2 text-muted-foreground'}>
          <Image src={cubeCollection[0].src} alt={'Clash Icon'} width={20} height={20}/>
          <span>3x3</span>
          <span>| Clash Started |</span>
          <span className={'flex items-center gap-1'}> <Hourglass size={14} fill={'#fff'}/> 00:15:23</span>
        </div>

        <div className={'flex flex-col justify-start items-center h-full'}>
          <div className={'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'}>Round 3/5</div>
          <div className={'px-4 text-center md:text-2xl 2xl:text-3xl'}>D2 F' L U R2 F U F' U B2 L2 U L2 U F2 U' R2 D2 F2
            D L
          </div>
          <div className={'text-4xl md:text-5xl lg:text-6xl xl:text-9xl grow flex items-center-safe justify-center bg-sidebar-primary/10 w-full'}>9.91</div>
          <div className={'pb-3 flex gap-2'}>
            <Button variant={'destructive'}>DNF</Button>
            <Button variant={'outline'}>+2</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

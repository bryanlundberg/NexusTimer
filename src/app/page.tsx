"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import ScrambleModal from "@/components/timer/ScrambleModal";
import FadeIn from "@/components/fade-in/fade-in";
import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';

export default function Home() {
  const resetTimerStore = useTimerStore((state) => state.reset);

  useEffect(() => {
    resetTimerStore();
  }, [resetTimerStore]);

  return (
    <>
      <FadeIn className={"flex flex-col grow overflow-hidden"}>
        <TimerContainer>
          <HeaderTimer/>
          <MainTimer/>
          <TimerWidgets/>
        </TimerContainer>
        <ScrambleModal/>
      </FadeIn>
    </>
  );
}

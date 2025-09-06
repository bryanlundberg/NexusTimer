"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import ScrambleModal from "@/components/timer/ScrambleModal";
import FadeIn from "@/components/fade-in/fade-in";
import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useTranslations } from 'next-intl';

export default function Home() {
  const resetTimerStore = useTimerStore((state) => state.reset);
  const t = useTranslations("Metadata");

  useEffect(() => {
    resetTimerStore();
  }, [resetTimerStore]);

  return (
    <>
      <FadeIn className={"flex flex-col grow"}>
        <h1 className="sr-only">{t("description")}</h1>
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

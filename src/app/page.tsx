"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import HintPanel from "@/components/timer/HintPanel";
import ScrambleModal from "@/components/timer/ScrambleModal";
import useInitializeTimer from "@/hooks/useInitializeHint";
import useForceHashSettings from "@/hooks/useForceHashSettings";

export default function Home() {
  useInitializeTimer();
  useForceHashSettings();

  return (
    <>
      <TimerContainer>
        <HeaderTimer />
        <MainTimer />
        <TimerWidgets />
      </TimerContainer>
      <HintPanel />
      <ScrambleModal />
    </>
  );
}

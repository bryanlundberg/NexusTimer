"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import HintPanel from "@/components/timer/HintPanel";
import ScrambleModal from "@/components/timer/ScrambleModal";
import FadeIn from "@/components/fade-in/fade-in";

export default function Home() {
  return (
    <>
      <FadeIn className={"flex flex-col grow"}>
        <TimerContainer>
          <HeaderTimer/>
          <MainTimer/>
          <TimerWidgets/>
        </TimerContainer>
        <HintPanel/>
        <ScrambleModal/>
      </FadeIn>
    </>
  );
}

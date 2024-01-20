"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import SettingsMenu from "@/components/menu-settings/Menu";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import FullscreenOption from "@/components/timer/FullscreenOption";
import HintPanel from "@/components/timer/HintPanel";
import ScrambleModal from "@/components/timer/ScrambleModal";
import useInitializeTimer from "@/hooks/useInitializeHint";
import ImportModal from "@/components/menu-settings/ImportModal";

export default function Home() {
  useInitializeTimer();
  return (
    <>
      <TimerContainer>
        <HeaderTimer />
        <MainTimer />
        <TimerWidgets />
      </TimerContainer>
      <SettingsMenu />
      <HintPanel />
      <FullscreenOption />
      <ScrambleModal />
      <ImportModal />
    </>
  );
}

"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import SettingsMenu from "@/components/menu-settings/Menu";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import FullscreenOption from "@/components/timer/FullScreenOption";

export default function Home() {
  return (
    <>
      <TimerContainer>
        <HeaderTimer />
        <MainTimer />
        <TimerWidgets />
      </TimerContainer>
      <SettingsMenu />
      <FullscreenOption />
    </>
  );
}

"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import SettingsMenu from "@/components/SettingsMenu";
import { useTimerStore } from "@/store/timerStore";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";

export default function Home() {
  const { settingsOpen } = useSettingsModalStore();
  const { isSolving } = useTimerStore();
  return (
    <>
      <TimerContainer>
        <HeaderTimer />
        <MainTimer />
        <TimerWidgets />
      </TimerContainer>
      {settingsOpen && !isSolving && <SettingsMenu />}
    </>
  );
}

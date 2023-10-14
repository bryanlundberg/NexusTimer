"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import TimerWidgets from "@/components/TimerWidgets";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import SettingsMenu from "@/components/SettingsMenu";
import Navigation from "@/components/Navigation";

export default function Home() {
  const { settingsOpen } = useSettingsModalStore();
  return (
    <>
      <div className="flex flex-col justify-between px-5 py-3 grow">
        <HeaderTimer />
        <Timer />
        <TimerWidgets />
      </div>
      {settingsOpen && <SettingsMenu />}
      <Navigation />
    </>
  );
}

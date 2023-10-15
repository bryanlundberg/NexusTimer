"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import TimerWidgets from "@/components/TimerWidgets";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import SettingsMenu from "@/components/SettingsMenu";
import Navigation from "@/components/Navigation";
import ManualMode from "@/components/ManualMode";

export default function Home() {
  const { settingsOpen, settings } = useSettingsModalStore();
  return (
    <>
      <div className="flex flex-col justify-between px-5 py-3 grow">
        <HeaderTimer />
        {settings.timer.manualMode.status ? <ManualMode /> : <Timer />}
        <TimerWidgets />
      </div>
      {settingsOpen && <SettingsMenu />}
      <Navigation />
    </>
  );
}

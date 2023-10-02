"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import TimerWidgets from "@/components/TimerWidgets";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import SettingsMenu from "@/components/SettingsMenu";

export default function Home() {
  const { settingsOpen } = useSettingsModalStore();
  return (
    <>
      <div className="grow flex flex-col justify-between py-3 px-5">
        <HeaderTimer />
        <Timer />
        <TimerWidgets />
      </div>
      {settingsOpen && <SettingsMenu />}
    </>
  );
}

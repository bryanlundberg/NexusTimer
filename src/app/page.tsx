"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import TimerWidgets from "@/components/TimerWidgets";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import SettingsMenu from "@/components/SettingsMenu";
import Navigation from "@/components/Navigation";
import ManualMode from "@/components/ManualMode";
import { useState } from "react";

export default function Home() {
  const { settingsOpen, settings } = useSettingsModalStore();
  const [isSolving, SetIsSolving] = useState(false);
  return (
    <>
      <div className="flex flex-col justify-between px-5 py-3 grow">
        {!isSolving && <HeaderTimer />}
        {settings.timer.manualMode.status ? (
          <ManualMode />
        ) : (
          <Timer setIsSolving={SetIsSolving} />
        )}
        {!isSolving && <TimerWidgets />}
      </div>
      {settingsOpen && !isSolving && <SettingsMenu />}
      {!isSolving && <Navigation />}
    </>
  );
}

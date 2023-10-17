"use client";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";
import loadCubes from "@/lib/loadCubes";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function PreloadSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCubes } = useTimerStore();
  const { setSettings, settings } = useSettingsModalStore();

  useEffect(() => {
    const getCubes = loadCubes();
    const getSettings = loadSettings();
    setSettings(getSettings);
    if (setCubes) setCubes(getCubes);
  }, [setCubes, setSettings]);

  return (
    <>
      <div
        className={`${settings ? settings.theme.background.color : "light"}`}
      >
        <div className="flex flex-col justify-between max-h-screen min-h-screen gap-2 select-none light:bg-neutral-50 light:text-zinc-950 dark:bg-zinc-950 dark:text-slate-50">
          {children}{" "}
        </div>
      </div>
    </>
  );
}

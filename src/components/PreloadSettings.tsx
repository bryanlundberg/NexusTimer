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
        <div className="flex flex-col justify-between max-h-screen min-h-screen gap-2 select-none light:bg-neutral-50 light:text-zinc-950 dark:bg-zinc-950 dark:text-slate-50 cyanviolet:bg-gradient-to-b cyanviolet:from-cyan-500 cyanviolet:to-violet-400 graygray:bg-gradient-to-b graygray:from-gray-900 graygray:to-gray-700 amberpink:bg-gradient-to-b amberpink:from-amber-500 amberpink:to-pink-400 redblue:bg-gradient-to-b redblue:from-red-500 redblue:to-blue-500 pinkneutral:bg-gradient-to-b pinkneutral:from-pink-200 pinkneutral:to-neutral-200 greenamber:bg-gradient-to-b greenamber:from-green-400 greenamber:to-amber-300">
          {children}{" "}
        </div>
      </div>
    </>
  );
}

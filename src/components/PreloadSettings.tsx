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
        <div className="select-none min-h-screen max-h-screen flex flex-col gap-2 justify-between light:bg-neutral-200 dark:bg-zinc-950 cyanviolet:bg-blue-500">
          {children}{" "}
        </div>
      </div>
    </>
  );
}

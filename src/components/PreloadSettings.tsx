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
  const { setSettings } = useSettingsModalStore();

  useEffect(() => {
    const getCubes = loadCubes();
    const getSettings = loadSettings();
    setSettings(getSettings);
    if (setCubes) setCubes(getCubes);
  }, [setCubes, setSettings]);

  return (
    <>
      <div
        className={`blue select-none min-h-screen max-h-screen flex flex-col gap-2 justify-between blue:bg-purple-500`}
      >
        {children}{" "}
      </div>
    </>
  );
}

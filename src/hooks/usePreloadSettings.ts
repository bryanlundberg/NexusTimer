import { useEffect } from "react";
import loadCubes from "@/lib/loadCubes";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";

export function usePreloadSettings() {
  const { setCubes } = useTimerStore();
  const { setSettings } = useSettingsModalStore();

  useEffect(() => {
    const getSettings = loadSettings();
    setSettings(getSettings);

    const getCubes = loadCubes();
    if (setCubes) setCubes(getCubes);
  }, [setCubes, setSettings]);
}

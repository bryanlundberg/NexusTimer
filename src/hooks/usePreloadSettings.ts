import { useEffect } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes } from "@/db/dbOperations";

export function usePreloadSettings() {
  const { setCubes } = useTimerStore();
  const { setSettings } = useSettingsModalStore();

  useEffect(() => {
    const getSettings = loadSettings();
    setSettings(getSettings);
    const getCubes = getAllCubes().then((res) => setCubes(res));
  }, [setCubes, setSettings]);
}

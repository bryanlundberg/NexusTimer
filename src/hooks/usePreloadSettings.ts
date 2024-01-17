import { useEffect } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";

export function usePreloadSettings() {
  const { setCubes } = useTimerStore();
  const { setSettings } = useSettingsModalStore();

  useEffect(() => {
    const getSettings = loadSettings();
    setSettings(getSettings);
    async function fetchData() {
      await setCubes();
    }
    fetchData();
  }, [setCubes, setSettings]);
}

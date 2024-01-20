import { useEffect } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes } from "@/db/dbOperations";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";

export function usePreloadSettings() {
  const { setCubes } = useTimerStore();
  const { setSettings } = useSettingsModalStore();
  const { setBackgroundImage } = useBackgroundImageStore();

  useEffect(() => {
    const getSettings = loadSettings();
    setSettings(getSettings);
  }, [setSettings]);

  useEffect(() => {
    getAllCubes().then((res) => setCubes(res));
  }, [setCubes]);

  useEffect(() => {
    const storedImage = localStorage.getItem("customBackgroundImage");
    if (storedImage) {
      setBackgroundImage(storedImage);
    }
  }, [setBackgroundImage]);
}

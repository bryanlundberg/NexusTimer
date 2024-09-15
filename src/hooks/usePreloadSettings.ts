import { useEffect } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes } from "@/db/dbOperations";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";

export function usePreloadSettings() {
  const { setCubes, setSelectedCube, setTimerStatistics, setNewScramble } =
    useTimerStore();
  const { setSettings } = useSettingsModalStore();
  const { setBackgroundImage } = useBackgroundImageStore();

  useEffect(() => {
    const getSettings = loadSettings();
    const defaultCube = getSettings.preferences.defaultCube.cube;
    setSelectedCube(defaultCube);
    setSettings(getSettings);
    setTimerStatistics();
    setNewScramble(defaultCube);
  }, [setSettings, setSelectedCube, setNewScramble, setTimerStatistics]);

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

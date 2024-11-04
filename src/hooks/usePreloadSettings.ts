import { useEffect, useState } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, getCubeById } from "@/db/dbOperations";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";

export function usePreloadSettings() {
  const { setCubes, setSelectedCube, setTimerStatistics, setNewScramble } =
    useTimerStore();
  const { setSettings } = useSettingsModalStore();
  const { setBackgroundImage } = useBackgroundImageStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    const defaultCube = settings.preferences.defaultCube.cube;

    if (defaultCube) {
      getCubeById(defaultCube.id)
        .then((c) => setSelectedCube(c))
        .catch((e) => {
          console.log(e);
          setSelectedCube(null);
        });
    }

    setSettings(settings);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
}

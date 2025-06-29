import { useEffect, useState } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, getCubeById } from "@/db/dbOperations";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";

export function usePreloadSettings() {
  const setCubes = useTimerStore(store => store.setCubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setTimerStatistics = useTimerStore(store => store.setTimerStatistics);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setSettings = useSettingsModalStore(store => store.setSettings);
  const setBackgroundImage = useBackgroundImageStore(store => store.setBackgroundImage);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    const defaultCubeId = settings.preferences.defaultCube;

    if (defaultCubeId && defaultCubeId !== "") {
      getCubeById(defaultCubeId)
        .then((c) => {
          setSelectedCube(c);
          setNewScramble(c);
        })
        .catch((e) => {
          console.log(e);
          setSelectedCube(null);
        });
    }

    setSettings(settings);
    setTimerStatistics();
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

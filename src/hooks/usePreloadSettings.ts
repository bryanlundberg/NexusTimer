import { useCallback, useEffect, useState } from 'react';
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useNXData } from '@/hooks/useNXData';

export function usePreloadSettings() {
  const setCubes = useTimerStore(store => store.setCubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setSettings = useSettingsModalStore(store => store.setSettings);
  const [isMounted, setIsMounted] = useState(false);
  const { getAllCubes, getCubeById} = useNXData();

  const initData = useCallback(async () => {
    const cubes = await getAllCubes();
    const settings = loadSettings();
    const defaultCubeId = settings.preferences.defaultCube;
    setCubes(cubes);
    setSettings(settings);
    if (defaultCubeId) {
      const defaultCube = await getCubeById(defaultCubeId);
      if (defaultCube) {
        setSelectedCube(defaultCube);
        setNewScramble(defaultCube);
      } else {
        console.warn("Default cube not found in the database, setting to null.");
        setSelectedCube(null);
      }
    } else {
      console.warn("No default cube ID set in settings, setting selected cube to null.");
      setSelectedCube(null);
    }
    return cubes;
  }, [getAllCubes, getCubeById, setCubes, setSelectedCube, setNewScramble, setSettings]);

  useEffect(() => {
    initData()
  }, [initData]);


  // TODO: Cloud sync functionality
  // NEED MORE TIME FOR TESTING BEFORE RE-ENABLING IN PRODUCTION ENVIRONMENT
  // useEffect(() => {
  //   const checkCloudData = async () => {
  //     if (session && session.user && session.user.email && !synced) {
  //       setSynced(true);
  //       try {
  //         const localCubes = await getAllCubes();
  //         const backup = await getLastBackup({ email: session.user.email });
  //         if (!backup) {
  //           return;
  //         }
  //
  //         const parsedBackup = JSON.parse(backup);
  //         const cloudBackup = JSON.parse(parsedBackup.data) as Cube[];
  //
  //         const syncedCubes = await syncBackup(cloudBackup, localCubes);
  //
  //         await saveBatchCubes(syncedCubes);
  //
  //         const selectedCube = useTimerStore.getState().selectedCube;
  //         if (selectedCube) {
  //           const syncedSelectedCube = syncedCubes.find(cube => cube.id === selectedCube.id);
  //           if (syncedSelectedCube) {
  //             useTimerStore.getState().setSelectedCube(syncedSelectedCube);
  //             useTimerStore.getState().setNewScramble(syncedSelectedCube);
  //           }
  //         }
  //
  //         setCubes(syncedCubes);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };
  //
  //   checkCloudData();
  // }, [session, setCubes, syncBackup, synced]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
}

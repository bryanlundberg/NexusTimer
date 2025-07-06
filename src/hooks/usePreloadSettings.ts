import { useEffect, useState } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, getCubeById } from '@/db/dbOperations';

export function usePreloadSettings() {
  const setCubes = useTimerStore(store => store.setCubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setSettings = useSettingsModalStore(store => store.setSettings);
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
  }, [setSettings, setSelectedCube, setNewScramble]);

  useEffect(() => {
    getAllCubes().then((res) => setCubes(res));
  }, [setCubes]);


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

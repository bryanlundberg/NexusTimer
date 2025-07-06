import { useEffect, useState } from "react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, getCubeById, saveBatchCubes } from '@/db/dbOperations';
import { useSession } from "next-auth/react";
import { getLastBackup } from '@/actions/actions';
import { Cube } from '@/interfaces/Cube';
import { useSyncBackup } from '@/hooks/useSyncBackup';

export function usePreloadSettings() {
  const setCubes = useTimerStore(store => store.setCubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setSettings = useSettingsModalStore(store => store.setSettings);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const [synced, setSynced] = useState(false);
  const { syncBackup } = useSyncBackup();

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

  useEffect(() => {
    const checkCloudData = async () => {
      if (session && session.user && session.user.email && !synced) {
        setSynced(true);
        try {
          const localCubes = await getAllCubes();
          const backup = await getLastBackup({ email: session.user.email });
          if (!backup) {
            return;
          }

          const parsedBackup = JSON.parse(backup);
          const cloudBackup = JSON.parse(parsedBackup.data) as Cube[];

          const localSolvesCount = localCubes.reduce((total, cube) => {
            return total + cube.solves.all.length + cube.solves.session.length;
          }, 0);

          const cloudSolvesCount = cloudBackup.reduce((total, cube) => {
            return total + cube.solves.all.length + cube.solves.session.length;
          }, 0);

          if (localSolvesCount === cloudSolvesCount) {
            return;
          }

          const syncedCubes = await syncBackup(cloudBackup, localCubes);

          setCubes(syncedCubes);
        } catch (error) {
          console.log(error);
        }
      }
    };

    checkCloudData();
  }, [session, setCubes, syncBackup, synced]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
}
